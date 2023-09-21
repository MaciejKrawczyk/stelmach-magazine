'use client'

import React, { useState } from "react";
import axios from "axios";
import SuccessModal from "@/components/form/modal/SuccessModal";
import config from "@/config.json";
import SubmitButton from "@/components/submitButton";
import Image from "next/image";
import loadingSVG from "@/public/Dual Ring-1.5s-191px.svg";
import ToastNotification from "@/components/form/notification/ToastNotification";
import Container from "@/components/Container";
import TextInput from "@/components/form/TextInput";
import InputDivider from "@/components/form/InputDivider";
import TypeValueAttributesInputItemTypeCreate from "@/components/form/TypeValueAttributesInputItemTypeCreate";

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

    //

    const handleNameChange = (e) => {
        let newValue = e.target.value.replace(/,/g, '.');
        setItemName(newValue);
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

        const newValue = value.replace(/,/g, '.');

        const list = [...inputList];
        list[index].value = newValue;
        setInputList(list);
    };

    //
    // // Handler to submit form

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

        console.log(payload)

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

    return (
        <Container>

        <SuccessModal
            isOpen={isOpen}
            text={config.ui.successModal.messages.item.smallText}
            objectData={object}
            bigText={config.ui.successModal.messages.item.bigText}
        />

            <ToastNotification shouldAppear={isError} text={toastText} />


            <h1 className={'font-semibold text-3xl my-10 mx-auto '}>Dodawanie typów przedmiotów</h1>

            <form onSubmit={handleSubmit}>

                <TextInput
                    id={'name'}
                    value={itemName}
                    setValue={setItemName}
                    note={''}
                    title={'Typ przedmiotu'}
                    placeholder={'Nazwa typu (np. narzędzie/tulejka...'}
                    description={'Typ przedmiotu - Sposób tworzenia typów jest pozostawiony użytkownikowi. Może to być np. narzędzie, tulejka etc. lub bardziej szczegółowy podział'}
                />

                <InputDivider />

                <TypeValueAttributesInputItemTypeCreate
                    title={'Cechy szczególne typu przedmiotu'}
                    note={'UWAGA! Zaleca się wpisywanie również jednostki w jakich będą wpisywane wartości cechy'}
                    inputList={inputList}
                    setInputList={setInputList}
                    typeAttributePlaceholder={'Cecha typu przedmiotu'}
                    description={'Są to cechy jakie trzeba będzie uzupełnić przy tworzeniu przedmiotu o danym type np. narzędzie może mieć cechy tj materiał, szerokość, wysokość, promień, a tulejka tj szerokość, wysokość itd.'}
                />

                <SubmitButton className={'mt-10'} isClicked={isClicked} />
            </form>

        </Container>
    );
};

export default Page;
