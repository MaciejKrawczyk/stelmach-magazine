'use client'

import React from 'react';
import Container from "@/src/components/Container";
import ParcelForm from "@/src/components/form/forms/ParcelForm";

const MyForm = () => {

    return (
        <Container title={'Dodawanie Wysyłki'}>
                <ParcelForm />
        </Container>
    );

};

export default MyForm;
