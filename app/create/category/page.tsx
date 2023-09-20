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
import ColorPickerInput from "@/components/form/ColorPickerInput";
import TextAreaInput from "@/components/form/TextAreaInput";
import {ShelfCategory, ShelfCategorySchema} from "@/types/zod/Shelf"
import ShelfCategoryForm from "@/components/form/forms/ShelfCategoryForm";
import FormStatusHandler from "@/components/form/FormStatusHandler";

const MyForm = () => {
    // Initialize state variables for the two text inputs

    const [name, setName] = useState('');
    const [color, setColor] = useState("#aabbcc")
    const [notes, setNotes] = useState('');
    //
    // const form: ShelfCategory = {
    //     name: name,
    //     color: color,
    //     notes: notes
    // }
    //
    // // submit button
    // const [isClicked, setIsClicked] = useState(false);
    //
    // // success modal
    // const [isOpen, setIsOpen] = useState(false);
    // const [object, setObject] = useState([]);
    //
    // const [isError, setIsError] = useState(false)
    // const [toastText, setToastText] = useState('')
    //
    //
    // // Function to handle form submission
    // const resetForm = () => {
    //     setName('');
    //     setNotes('');
    //     setColor("#aabbcc");
    // };
    //
    // const displayError = (e) => {
    //     console.error(e);
    //     setIsError(true);
    //     setIsClicked(false);
    //
    //     if (e.response && e.response.status === 409) {
    //         setToastText('Przedmiot z tym numerem istnieje juz w bazie');
    //     } else {
    //         setToastText('Wystąpił błąd przy dodawaniu przedmiotu do bazy');
    //     }
    // };
    //
    // const sendForm = async () => {
    //     const response = await axios.post('/api/category', form);
    //     console.log(response);
    //     setObject(response.data);
    // };
    //
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //
    //     if (name.trim() === '' || notes.trim() === '') {
    //         alert("Pola nie mogą być puste!");
    //         return;
    //     }
    //
    //     setIsClicked(true);
    //     setIsOpen(false);
    //
    //     try {
    //         const validation = ShelfCategorySchema.safeParse(form);
    //
    //         if (!validation.success) {
    //             // Handle validation error here, if needed
    //             throw new Error("ZOD validation failed");
    //         }
    //
    //         await sendForm();
    //
    //         setIsOpen(true);
    //         setIsClicked(false);
    //         resetForm();
    //
    //     } catch (error) {
    //         displayError(error);
    //     }
    // };


    return (
        <Container>
            {/*<SuccessModal*/}
            {/*    isOpen={isOpen}*/}
            {/*    text={config.ui.successModal.messages.company.smallText}*/}
            {/*    objectData={object}*/}
            {/*    bigText={config.ui.successModal.messages.company.bigText}*/}
            {/*/>*/}
            {/**/}
            {/*<ToastNotification shouldAppear={isError} text={toastText} />*/}
            <h1 className={'font-semibold text-3xl my-10 mx-auto '}>Dodawanie kategorii szuflad</h1>

                <ShelfCategoryForm
                    color={color}
                    setColor={setColor}
                    name={name}
                    setName={setName}
                    notes={notes}
                    setNotes={setNotes}
                />

                {/*<form onSubmit={handleSubmit}>*/}
                {/**/}
                {/*    <TextInput*/}
                {/*        id={'name'}*/}
                {/*        description={'Nazwa kategorii, która ma ułatwić segregowanie przedmiotów w szafie'}*/}
                {/*        placeholder={'nazwa kategorii'}*/}
                {/*        note={''}*/}
                {/*        value={name}*/}
                {/*        setValue={setName}*/}
                {/*        title={'Nazwa kategorii'}*/}
                {/*    />*/}
                {/**/}
                {/*    <InputDivider />*/}
                {/**/}
                {/*    <ColorPickerInput*/}
                {/*        title={'Kolor kategorii'}*/}
                {/*        color={color}*/}
                {/*        note={''}*/}
                {/*        setColor={setColor}*/}
                {/*        description={'Ustaw kolor, który ułatwi wizualne rozpoznanie szuflad w kategorii'}*/}
                {/*    />*/}
                {/**/}
                {/*    <InputDivider />*/}
                {/**/}
                {/*    <TextAreaInput*/}
                {/*        note={''}*/}
                {/*        description={'Opis kategorii, ważna informacja dla obsługującego szafy'}*/}
                {/*        title={'Opis kategorii'}*/}
                {/*        setValue={setNotes}*/}
                {/*        value={notes}*/}
                {/*        placeholder={'Notatki'}*/}
                {/*        id={'notes'}*/}
                {/*    />*/}
                {/**/}
                {/*    <SubmitButton className={'mt-10'} isClicked={isClicked} />*/}
                {/**/}
                {/*</form>*/}

        </Container>
    );
};

export default MyForm;
