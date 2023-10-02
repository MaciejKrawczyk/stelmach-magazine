'use client'

import React from "react";
import Container from "@/components/Container";
import OrderForm from "@/components/form/forms/OrderForm";

const App = () => {

    return (
        <Container title={'Dodawanie przedmiotów'}>
            <OrderForm />
        </Container>
    );
};

export default App;
