'use client'

import React, { useState } from 'react';
import Container from "@/components/Container";
import CompanyForm from "@/components/form/forms/CompanyForm";

const MyForm = () => {

    return (
        <Container title={'Dodawanie Firm'}>

            <CompanyForm />

        </Container>
    );
};

export default MyForm;
