'use client'

import React, { useState } from 'react';
import axios from "axios";
import SubmitButton from "@/components/submitButton";
import SuccessModal from "@/components/form/modal/SuccessModal";
import config from '../../../config.json'
import ToastNotification from "@/components/form/notification/ToastNotification";
import Container from "@/components/Container";
import TextInput from "@/components/form/TextInput";
import InputDivider from "@/components/form/InputDivider";
import TextAreaInput from "@/components/form/TextAreaInput";

const MyForm = () => {
    // Initialize state variables for the two text inputs
    const [name, setName] = useState('');
    const [notes, setNotes] = useState('');

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
        if (name.trim() === '' || notes.trim() === '') {
            alert("Pola nie mogą być puste!");
            return;
        }

        setIsClicked(true);
        setIsOpen(false);

        const payload = {
            name: name,
            notes: notes,
        };

        try {
            const data = await axios.post('/api/company', payload);
            setObject(data.data);
            console.log(data);

            setIsOpen(true);
            setIsClicked(false);

            setName('');
            setNotes('');

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


    return (<Container>

            <SuccessModal
                isOpen={isOpen}
                text={config.ui.successModal.messages.company.smallText}
                objectData={object}
                bigText={config.ui.successModal.messages.company.bigText}
            />

            <ToastNotification shouldAppear={isError} text={toastText} />

                <h1 className={'font-semibold text-3xl my-10 mx-auto '}>Dodawanie Firm</h1>

                <form onSubmit={handleSubmit}>

                    <TextInput
                        id={'name'}
                        note={''}
                        placeholder={'Nazwa firmy'}
                        value={name}
                        setValue={setName}
                        title={'Nazwa firmy'}
                        description={'Nazwa firmy np. producent, firma, która ostrzy, firma świadcząca jakąś usługę'}
                    />

                    <InputDivider />

                    <TextAreaInput
                        description={'Ważne informacje o firmie np. telefon kontaktowy, adres, email, opis'}
                        title={'Opis przedmiotu'}
                        setValue={setNotes}
                        value={notes}
                        note={''}
                        placeholder={'Notatki'}
                        id={'notes'}
                    />

                    <SubmitButton className={'mt-10'} isClicked={isClicked} />
                </form>
        </Container>
    );
};

export default MyForm;
