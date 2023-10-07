'use client'

import React from 'react';
import Container from "@/src/components/Container";
import OrderCategoryForm from "@/src/components/form/forms/OrderCategoryForm";

const MyForm = () => {

    return (
        <Container title={'Dodawanie Zamówienia'}>

            <OrderCategoryForm />

        </Container>
    );
};

export default MyForm;
