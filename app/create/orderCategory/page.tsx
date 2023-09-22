'use client'

import React, { useState } from 'react';
import Container from "@/components/Container";
import OrderCategoryForm from "@/components/form/forms/OrderCategoryForm";

const MyForm = () => {

    const [formData, setFormData] = useState({
        name: "",
        color: "#FF33FF",
        description: ""
    })

    return (
        <Container title={'Dodawanie Zamówienia'}>

            <OrderCategoryForm
                setFormData={setFormData}
                formData={formData}
            />

        </Container>
    );
};

export default MyForm;
