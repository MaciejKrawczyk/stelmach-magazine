'use client'

import React, { useState } from 'react';
import Container from "@/components/Container";
import CompanyForm from "@/components/form/forms/CompanyForm";

const MyForm = () => {
    // Initialize state variables for the two text inputs
    const [name, setName] = useState('');
    const [notes, setNotes] = useState('');

    return (
        <Container title={'Dodawanie Firm'}>

            <CompanyForm
                setName={setName}
                name={name}
                notes={notes}
                setNotes={setNotes}
            />

        </Container>
    );
};

export default MyForm;
