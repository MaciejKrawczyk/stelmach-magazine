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

    return (
        <Container title={'Dodawanie kategorii szuflad'}>

                <ShelfCategoryForm
                    color={color}
                    setColor={setColor}
                    name={name}
                    setName={setName}
                    notes={notes}
                    setNotes={setNotes}
                />

        </Container>
    );
};

export default MyForm;
