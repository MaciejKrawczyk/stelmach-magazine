'use client'

import React, { useState } from 'react';
import Container from "@/components/Container";
import OrderCategoryForm from "@/components/form/forms/OrderCategoryForm";

const MyForm = () => {

    const [name, setName] = useState('');
    const [color, setColor] = useState("#aabbcc")
    const [description, setDescription] = useState('');


    return (
        <Container title={'Dodawanie Zamówienia'}>

            <OrderCategoryForm
                name={name}
                setName={setName}
                setColor={setColor}
                color={color}
                setDescription={setDescription}
                description={description}
            />

        </Container>
    );
};

export default MyForm;
