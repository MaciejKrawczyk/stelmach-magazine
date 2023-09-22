'use client'

import React, {useState} from "react";
import Container from "@/components/Container";
import OrderForm from "@/components/form/forms/OrderForm";

const App = () => {

    const [formData, setFormData] = useState({
        orderCategoryId: "",
        isOrder: true,
        quantity: 1,
        name: `ORDER`,
        description: "",
        itemType: "",
        companyId: "",
        placeId: 18,  // Initialize placeId with the value "1"
        shelfType: 'small',
        shelfCategory: 1,
        shelfId: -1,
        typeAttributes: {}
    });


    return (
        <Container title={'Dodawanie przedmiotów'}>

            <OrderForm
                formData={formData}
                setFormData={setFormData}
            />

        </Container>
    );
};

export default App;
