'use client'

import React, { useState } from 'react';
import Container from "@/components/Container";
import CompanyForm from "@/components/form/forms/CompanyForm";

const MyForm = () => {

    const [formData, setFormData] = useState({
        name: "",
        notes: ""
    })

    return (
        <Container title={'Dodawanie Firm'}>

            <CompanyForm
                setFormData={setFormData}
                formData={formData}
            />

        </Container>
    );
};

export default MyForm;
