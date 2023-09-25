'use client'

import React, { useState } from "react";
import Container from "@/components/Container";
import ItemTypeForm from "@/components/form/forms/ItemTypeForm";

const Page = () => {

    const [formData, setFormData] = useState({
        name: "",
        list: []
    })

    return (
        <Container title={'Dodawanie typów przedmiotów'}>

            <ItemTypeForm
                setFormData={setFormData}
                formData={formData}
            />

        </Container>
    );
};

export default Page;
