'use client'

import React, {useEffect, useState} from 'react';
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
import SelectInput from "@/components/form/SelectInput";
import TextAreaInput from "@/components/form/TextAreaInput";
import ParcelCategoryForm from "@/components/form/forms/ParcelCategoryForm";

const MyForm = () => {

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        color: "#FF33FF",
        companyId: undefined, // not defined
        notes: ""
    })

    return (
        <Container title={'Dodawanie Wysyłki'}>
                <ParcelCategoryForm
                    formData={formData}
                    setFormData={setFormData}
                />
        </Container>
    );

};

export default MyForm;
