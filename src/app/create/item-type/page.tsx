'use client'

import React from "react";
import Container from "@/src/components/Container";
import ItemTypeForm from "@/src/components/form/forms/ItemTypeForm";

const Page = () => {

    return (
        <Container title={'Dodawanie typów przedmiotów'}>

            <ItemTypeForm />

        </Container>
    );
};

export default Page;
