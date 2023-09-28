'use client'

import React from 'react';
import Container from "@/components/Container";
import ShelfCategoryForm from "@/components/form/forms/ShelfCategoryForm";

const MyForm = () => {

    return (
        <Container title={'Dodawanie kategorii szuflad'}>
                <ShelfCategoryForm />
        </Container>
    );
};

export default MyForm;
