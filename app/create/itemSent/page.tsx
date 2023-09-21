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
    // Initialize state variables for the two text inputs
    const [name, setName] = useState('');
    const [color, setColor] = useState("#aabbcc")
    const [description, setDescription] = useState('');
    const [company, setCompany] = useState('')

    const [companies, setCompanies] = useState([])

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
        console.log(companies)
    }, []);


    return (
        <Container title={'Dodawanie Wysyłki'}>
                <ParcelCategoryForm
                    color={color}
                    setColor={setColor}
                    description={description}
                    setDescription={setDescription}
                    setCompany={setCompany}
                    company={company}
                    companies={companies}
                    setName={setName}
                    name={name}
                />
        </Container>
    );

};

export default MyForm;
