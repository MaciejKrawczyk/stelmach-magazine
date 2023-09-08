'use client'

import React, { useState } from "react";
import axios from "axios";
import SuccessModal from "@/components/SuccessModal";
import config from "@/config.json";
import SubmitButton from "@/components/submitButton";
import Image from "next/image";
import loadingSVG from "@/public/Dual Ring-1.5s-191px.svg";
import ToastNotification from "@/components/ToastNotification";

const Page = () => {

    const [inputList, setInputList] = useState([{ value: "", disabled: false }]);
    const [itemName, setItemName] = useState("");  // New state variable for the 'name' input

    // submit button
    const [isClicked, setIsClicked] = useState(false);
// success modal
    const [isOpen, setIsOpen] = useState(false);
    const [object, setObject] = useState([]);

    const [isError, setIsError] = useState(false)
    const [toastText, setToastText] = useState('')



    const handleNameChange = (e) => {
        setItemName(e.target.value);
    };

    // Handler to add a new input field
    const handleAddInput = (e) => {
        e.preventDefault();
        const list = inputList.map(field => ({ ...field, disabled: true }));
        list.unshift({ value: "", disabled: false });
        setInputList(list);
    };

    // Handler to remove an input field
    const handleRemoveInput = (index, e) => {
        e.preventDefault();  // Prevent form submission
        const list = [...inputList];
        list.splice(index, 1);
        setInputList(list);
    };

    // Handler to update input value
    const handleInputChange = (e, index) => {
        const { value } = e.target;
        const list = [...inputList];
        list[index].value = value;
        setInputList(list);
    };

    // Handler to submit form
    // Handler to submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsError(false)

        console.log(inputList)
        if (itemName.trim() === '' || (inputList[0].value === '' && inputList.length === 1)) {
            alert("Pola nie mogą być puste!");
            return;
        }

        setIsClicked(true);
        setIsOpen(false);


        const payload = {
            name: itemName,
            list: inputList,
        };

        try {
            const data = await axios.post('/api/itemtype', payload);
            setObject(data.data);
            console.log(data);

            setIsOpen(true);
            setIsClicked(false);


        } catch (e) {

            // console.error(e)
            setIsError(true)
            setIsClicked(false);
            if (e.response.status === 409) {
                setToastText('Przedmiot z tym numerem istnieje juz w bazie')
            } else {
                setToastText('Wystąpił błąd przy dodawaniu przedmiotu do bazy')
            }

        }
    };

    return (<div className={'flex justify-center'}>

        <SuccessModal
            isOpen={isOpen}
            text={config.ui.successModal.messages.item.smallText}
            objectData={object}
            bigText={config.ui.successModal.messages.item.bigText}
        />

            <ToastNotification shouldAppear={isError} text={toastText} />

            <main className={'w-9/12 h-auto mb-28'}>

            <h1 className={'font-semibold text-3xl my-10 mx-auto '}>Dodawanie typów przedmiotów</h1>

            <form onSubmit={handleSubmit}>




                <div className="w-full flex justify-between">
                    <div className="w-1/3">
                        <h2 className="text-lg mb-2">Typ przedmiotu</h2>
                        <p className="text-zinc-500 font-light text-sm">
                            Typ przedmiotu - Sposób tworzenia typów jest pozostawiony użytkownikowi.
                            Może to być np. narzędzie, tulejka etc. lub bardziej szczegółowy podział
                        </p>
                    </div>
                    <div className="w-1/3 text-xs">
                        <div className="flex flex-col">
                            <div className="flex justify-center items-center">
                                {/*<div className="mx-3 px-2 bg-amber-600 cursor-pointer text-white aspect-square flex justify-center items-center rounded-3xl">+</div>*/}
                                <input
                                    className="border-2 w-full border-gray-300 rounded-lg p-3 text-sm focus:border-gray-500 focus:shadow-lg transition duration-150 ease-in-out"
                                    name={'name'}
                                    type="text"
                                    placeholder={"nazwa typu (np. narzędzie/tulejka...)"}
                                    value={itemName} // Update the value based on state
                                    onChange={handleNameChange}  // Update state when input changes
                                />

                            </div>
                            <span className="pt-3 pl-1 mb-2 text-gray-500"></span>
                        </div>
                    </div>
                </div>

                <hr className={'my-7'}/>

                <div className="w-full flex justify-between">
                    <div className="w-1/3">
                        <h2 className="text-lg mb-2">Cechy szczególne typu przedmiotu</h2>
                        <p className="text-zinc-500 font-light text-sm">
                            Są to cechy jakie trzeba będzie uzupełnić przy tworzeniu przedmiotu o danym type -
                            np. narzędzie może mieć cechy tj materiał, szerokość, wysokość, promień, a tulejka tj szerokość, wysokość itd.
                        </p>
                    </div>
                    <div className="w-1/3 text-xs">
                        <div className="flex flex-col w-full">
                            <div className="flex justify-center items-center w-full flex-col">
                                    <div className={'flex w-full'}>
                                        <input
                                            placeholder={'cecha typu przedmiotu'}
                                            className="my-2 border-2 w-full border-gray-300 rounded-lg p-3 text-sm focus:border-gray-500 focus:shadow-lg transition duration-150 ease-in-out"
                                            type="text"
                                            value={inputList[0]?.value}
                                            disabled={inputList[0]?.disabled}
                                            onChange={(e) => handleInputChange(e, 0)}
                                        />
                                        <button
                                            className="mx-3 my-2 w-12 h-auto bg-amber-600 cursor-pointer text-white flex justify-center items-center rounded-3xl"
                                            onClick={(e) => handleAddInput(e)} disabled={!inputList[0]?.value}
                                        >+</button>
                                    </div>
                                    {inputList.slice(1).map((inputField, index) => (
                                        <div className={'flex w-full'} key={index + 1}>
                                            <input
                                                className="my-2 border-2 w-full border-gray-300 rounded-lg p-3 text-sm focus:border-gray-500 focus:shadow-lg transition duration-150 ease-in-out"
                                                type="text"
                                                value={inputField.value}
                                                disabled={inputField.disabled}
                                                onChange={(e) => handleInputChange(e, index + 1)}
                                            />
                                            {inputList.length > 1 && (
                                                <button
                                                    className="mx-3 my-2 w-12 h-auto bg-red-600 cursor-pointer text-white flex justify-center items-center rounded-3xl"
                                                    onClick={(e) => handleRemoveInput(index + 1, e)}
                                                >-</button>
                                            )}
                                        </div>
                                    ))}

                            </div>
                            <span className="pt-3 pl-1 mb-2 text-gray-500"></span>
                        </div>
                    </div>
                </div>





                {/*<input*/}
                {/*    name={'name'}*/}
                {/*    type="text"*/}
                {/*    placeholder={"nazwa typu (np. narzędzie/tulejka...)"}*/}
                {/*    value={itemName} // Update the value based on state*/}
                {/*    onChange={handleNameChange}  // Update state when input changes*/}
                {/*/>*/}

                {/*<div>*/}
                {/*    <input*/}
                {/*        type="text"*/}
                {/*        value={inputList[0]?.value}*/}
                {/*        disabled={inputList[0]?.disabled}*/}
                {/*        onChange={(e) => handleInputChange(e, 0)}*/}
                {/*    />*/}
                {/*    <button onClick={(e) => handleAddInput(e)} disabled={!inputList[0]?.value}>Add</button>*/}
                {/*</div>*/}

                {/*{inputList.slice(1).map((inputField, index) => (*/}
                {/*    <div key={index + 1}>*/}
                {/*        <input*/}
                {/*            type="text"*/}
                {/*            value={inputField.value}*/}
                {/*            disabled={inputField.disabled}*/}
                {/*            onChange={(e) => handleInputChange(e, index + 1)}*/}
                {/*        />*/}
                {/*        {inputList.length > 1 && (*/}
                {/*            <button onClick={(e) => handleRemoveInput(index + 1, e)}>Remove</button>*/}
                {/*        )}*/}
                {/*    </div>*/}
                {/*))}*/}
                <SubmitButton className={'mt-10'} isClicked={isClicked} />
            </form>

            </main>
        </div>
    );
};

export default Page;
