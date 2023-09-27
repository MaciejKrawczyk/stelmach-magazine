'use client'

import React from 'react';
import Container from "@/components/Container";
import ParcelCategoryForm from "@/components/form/forms/ParcelCategoryForm";

const MyForm = () => {

    return (
        <Container title={'Dodawanie Wysyłki'}>
                <ParcelCategoryForm />
        </Container>
    );

};

export default MyForm;
