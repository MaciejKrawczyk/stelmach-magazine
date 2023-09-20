'use client'

import React, { useState } from 'react';
import axios from "axios";
import SubmitButton from "@/components/submitButton";
import SuccessModal from "@/components/form/modal/SuccessModal";
import config from '../../../config.json'
import ToastNotification from "@/components/form/notification/ToastNotification";
import { HexColorPicker } from "react-colorful";
import Container from "@/components/Container";
import TextInput from "@/components/form/TextInput";
import InputDivider from "@/components/form/InputDivider";
import ColorPickerInput from "@/components/form/ColorPickerInput";
import TextAreaInput from "@/components/form/TextAreaInput";

const MyForm = () => {
    // Initialize state variables for the two text inputs
    const [name, setName] = useState('');
    const [color, setColor] = useState("#aabbcc")
    const [description, setDescription] = useState('');

    // submit button
    const [isClicked, setIsClicked] = useState(false);

    // success modal
    const [isOpen, setIsOpen] = useState(false);
    const [object, setObject] = useState([]);

    const [isError, setIsError] = useState(false)
    const [toastText, setToastText] = useState('')


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
        };

        try {
            const data = await axios.post('/api/orderCategory', payload);
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


    return (
        <Container>

            <SuccessModal
                isOpen={isOpen}
                text={'Pomyślnie dodano zamówienie na przedmioty, teraz możesz dodawać przedmioty do tego zamówienia!'}
                objectData={object}
                bigText={'Dodano zamówienie'}
            />

            <ToastNotification shouldAppear={isError} text={toastText} />


                <h1 className={'font-semibold text-3xl my-10 mx-auto '}>Dodawanie Zamówienia</h1>

                <form onSubmit={handleSubmit}>

                    <TextInput
                        id={'name'}
                        note={''}
                        value={name}
                        setValue={setName}
                        description={'Nazwa zamówienia lub numer, który ułatwi Tobie wyszukanie zamówienia'}
                        placeholder={'Nazwa zamówienia'}
                        title={'Nazwa zamówienia'}
                    />

                    <InputDivider />

                    <ColorPickerInput
                        title={'Kolor zamówienia'}
                        color={color}
                        setColor={setColor}
                        note={''}
                        description={'Ustaw kolor, aby dane zamówienie wyróżniało się na tle innych'}
                    />

                    <InputDivider />

                    <TextAreaInput
                        note={''}
                        title={'Opis zamówienia'}
                        description={'Opis zamówienia, ważna informacja dla obsługującego szafy'}
                        placeholder={'Opis'}
                        value={description}
                        setValue={setDescription}
                        id={'description'}
                    />

                    <SubmitButton className={'mt-10'} isClicked={isClicked} />

                </form>

        </Container>
    );
};

export default MyForm;
