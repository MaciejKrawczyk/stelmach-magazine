'use client'

import React from 'react';
import Container from "@/components/Container";
import OrderCategoryForm from "@/components/form/forms/OrderCategoryForm";

const MyForm = () => {

    return (
        <Container title={'Dodawanie Zamówienia'}>

            <OrderCategoryForm />

        </Container>
    );
};

export default MyForm;
