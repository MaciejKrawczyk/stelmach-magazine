'use client'

import React, {useEffect, useState} from 'react';
import axios from "axios";
import SubmitButton from "@/components/submitButton";
import SuccessModal from "@/components/form/modal/SuccessModal";
import config from '../../../config.json'
import ToastNotification from "@/components/form/notification/ToastNotification";
import { HexColorPicker } from "react-colorful";

const MyForm = () => {
    // Initialize state variables for the two text inputs
    const [name, setName] = useState('');
    const [color, setColor] = useState("#aabbcc")
    const [description, setDescription] = useState('');
    const [company, setCompany] = useState('')

    const [companies, setCompanies] = useState([])

    // submit button
    const [isClicked, setIsClicked] = useState(false);

    // success modal
    const [isOpen, setIsOpen] = useState(false);
    const [object, setObject] = useState([]);

    const [isError, setIsError] = useState(false)
    const [toastText, setToastText] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const companiesResponse = await axios.get('/api/company');
                setCompanies(companiesResponse.data);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchData();
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;
        const newValue = value.replace(/,/g, '.');
        setCompany(newValue)

    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check for empty strings
        if (name.trim() === '' || description.trim() === '') {
            alert("Pola nie mogą być puste!");
            return;
        }

        setIsClicked(true);
        setIsOpen(false);

        const payload = {
            name: name,
            color: color,
            description: description,
            companyId: company
        };

        try {
            const data = await axios.post('/api/itemSent', payload);
            setObject(data.data);
            console.log(data);

            setIsOpen(true);
            setIsClicked(false);

            setName('');
            setDescription('');
            setColor("#aabbcc")

        } catch (e) {

            console.error(e)
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
                text={'Pomyślnie dodano wysyłkę przedmiotów!'}
                objectData={object}
                bigText={'Dodano wysyłkę'}
            />

            <ToastNotification shouldAppear={isError} text={toastText} />

            <main className={'w-9/12 h-auto mb-28'}>

                <h1 className={'font-semibold text-3xl my-10 mx-auto '}>Dodawanie Wysyłki</h1>

                <form onSubmit={handleSubmit}>

                    <div className={'w-full flex justify-between'}>
                        <div className={'w-2/5'}>
                            <h2 className={'text-lg mb-2'}>Nazwa wysyłki</h2>
                            <p className={'text-zinc-500 font-light text-sm'}>Nazwa wysyłki lub numer, który ułatwi Tobie jej wyszukanie</p>
                        </div>
                        <div className={'w-1/3 text-xs text-red-600'}>
                            <div className={'flex flex-col'}>
                                <input
                                    className="border-2 w-full border-gray-300 rounded-lg p-3 text-sm focus:border-gray-500 focus:shadow-lg transition duration-150 ease-in-out"
                                    placeholder={'nazwa wysyłki'}
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => {
                                        const newValue = e.target.value.replace(/,/g, '.');
                                        setName(newValue)
                                    }}
                                />
                                <span className={'pt-3 pl-1'} ></span>
                            </div>
                        </div>
                    </div>

                    <hr className={'my-7'}/>

                    <div className={'w-full flex justify-between'}>
                        <div className={'w-2/5'}>
                            <h2 className={'text-lg mb-2'}>Kolor wysyłki</h2>
                            <p className={'text-zinc-500 font-light text-sm'}>Ustaw kolor, aby dane wysyłki wyróżniały się na tle innych</p>
                        </div>
                        <div className={'w-1/3 text-xs text-red-600'}>
                            <div className={'flex flex-col'}>
                                <HexColorPicker color={color} onChange={setColor} />
                                <span className={'pt-3 pl-1'} ></span>
                            </div>
                        </div>
                    </div>

                    <hr className={'my-7'}/>

                    <div className="w-full flex justify-between">
                        <div className="w-1/3">
                            <h2 className="text-lg mb-2">Producent</h2>
                            <p className="text-zinc-500 font-light text-sm">
                                Producent przedmiotu jest wybierany z listy wszystkich firm dodanych do bazy.
                            </p>
                        </div>
                        <div className="w-1/3 text-xs">
                            <div className="flex flex-col">
                                <div className="flex justify-center items-center">
                                    {/*<div className="mx-3 px-2 bg-amber-600 cursor-pointer text-white aspect-square flex justify-center items-center rounded-3xl">+</div>*/}

                                    <select
                                        className="w-full border-gray-300 p-3 rounded-lg text-sm focus:border-gray-500 focus:shadow-lg transition duration-150 ease-in-out"
                                        name="companyId"
                                        value={company.id}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled>Wybierz firmę</option>
                                        {companies.map((company, index) => (
                                            <option key={index} value={company.id}>
                                                {company.name}
                                            </option>
                                        ))}
                                    </select>

                                </div>
                                <span className="pt-3 pl-1 mb-2 text-gray-500">Wybierz producenta z listy</span>
                            </div>
                        </div>
                    </div>

                    <hr className={'my-7'}/>

                    <div className={'w-full flex justify-between'}>
                        <div className={'w-2/5'}>
                            <h2 className={'text-lg mb-2'}>Opis wysyłki</h2>
                            <p className={'text-zinc-500 font-light text-sm'}>Opis wysyłki, ważna informacja dla obsługującego szafy</p>
                        </div>
                        <div className={'w-1/3 text-xs text-red-600'}>
                            <div className={'flex flex-col'}>
                                <textarea
                                    placeholder={'Opis'}
                                    className="border-2 w-full border-gray-300 rounded-lg p-3 text-sm focus:border-gray-500 focus:shadow-lg transition duration-150 ease-in-out"
                                    id="description"
                                    value={description}
                                    onChange={(e) => {
                                        const newValue = e.target.value.replace(/,/g, '.');
                                        setDescription(newValue)
                                    }}
                                ></textarea>
                                <span className={'pt-3 pl-1'} ></span>
                            </div>
                        </div>
                    </div>

                    <SubmitButton className={'mt-10'} isClicked={isClicked} />
                </form>
            </main>
        </div>
    );
};

export default MyForm;
