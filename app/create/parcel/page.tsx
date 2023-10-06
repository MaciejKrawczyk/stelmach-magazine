'use client'

import React from 'react';
import Container from "@/components/Container";
import ParcelForm from "@/components/form/forms/ParcelForm";

const MyForm = () => {

    return (
        <Container title={'Dodawanie Wysyłki'}>
                <ParcelForm />
        </Container>
    );

};

export default MyForm;
