'use client'

import React from "react";
import Container from "@/src/components/Container";
import OrderForm from "@/src/components/form/forms/OrderForm";

const App = () => {

    return (
        <Container title={'Dodawanie przedmiotów'}>
            <OrderForm />
        </Container>
    );
};

export default App;
