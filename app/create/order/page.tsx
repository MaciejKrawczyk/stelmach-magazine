'use client'

import React, {useEffect, useState} from "react";
import {Shelves} from "@/objects/Shelves";
import {Places} from "@/objects/Places";
import axios from "axios";
import SubmitButton from "@/components/submitButton";
import SuccessModal from "@/components/form/modal/SuccessModal";
import config from "@/config.json";
import loadingSVG from "@/public/Dual Ring-1.5s-191px.svg";
import Image from "next/image";
import ToastNotification from "@/components/form/notification/ToastNotification";
import {generateRandomUUID} from "@/utils/generateRandomUUID";
import {Container} from "@/components/Container";
import NumberInput from "@/components/form/NumberInput";
import SelectInput from "@/components/form/SelectInput";
import InputDivider from "@/components/form/InputDivider";
import TextAreaInput from "@/components/form/TextAreaInput";
import ItemTypeAttributesInput from "@/components/form/ItemTypeAttributesInput";

const App = () => {

    const [formData, setFormData] = useState({
        orderCategoryId: "",
        isOrder: true,
        quantity: 1,
        name: `ORDER`,
        description: "",
        itemType: "",
        companyId: "",
        placeId: "18",  // Initialize placeId with the value "1"
        shelfType: 'small',
        shelfCategory: 1,
        shelfId: -1,
        typeAttributes: {}
    });

    const [typeAttributes, setTypeAttributes] = useState([]);
    const [companyIds, setCompanyIds] = useState([]);
    const [orderCategories, setOrderCategories] = useState([])


    useEffect(() => {
        const fetchData = async () => {
            try {
                const companiesResponse = await axios.get('/api/company');
                const orderCategoriesResponse = await axios.get('/api/orderCategory')
                setCompanyIds(companiesResponse.data);
                setOrderCategories(orderCategoriesResponse.data)
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchData();
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;

        const newValue = value.replace(/,/g, '.');

        setFormData({
            ...formData,
            [name]: newValue,
        });
    };


    // const handleAttributesChange = (e) => {
    //     const { name, value } = e.target;
    //
    //     const newValue = value.replace(/,/g, '.');
    //
    //     // Update only the specific attribute value that was changed
    //     setFormData(prevState => ({
    //         ...prevState,
    //         typeAttributes: {
    //             ...prevState.typeAttributes,
    //             [name]: newValue
    //         }
    //     }));
    // };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //
    //     setIsError(false)
    //
    //     // Check if any property value in formData is an empty string
    //     const isAnyFieldEmpty = Object.values(formData).some(value => value === "");
    //
    //     // Check if any type attribute in formData.typeAttributes is an empty string
    //     const areTypeAttributesEmpty = typeAttributes.some(attribute => {
    //         return formData.typeAttributes[attribute.id] === undefined || formData.typeAttributes[attribute.id] === "";
    //     });
    //
    //     console.log(formData)
    //
    //     if (isAnyFieldEmpty) {
    //         alert("Wszystkie pola muszą być wypełnione.");
    //         return;
    //     }
    //
    //     if (areTypeAttributesEmpty) {
    //         alert("Wszystkie szczegółowe dane typu predmiotu nie mogą być puste.");
    //         return;
    //     }
    //
    //     setIsClicked(true);
    //     setIsOpen(false);
    //
    //     let payload = formData
    //
    //     try {
    //         for (let i=0;i<formData.quantity;i++) {
    //             const randomUUID = generateRandomUUID()
    //             payload.name = `ORDER | ${randomUUID}`
    //             const data = await axios.post('/api/item', payload)
    //             setObject(data.data);
    //         }
    //             console.log("Form data submitted", formData);
    //             setIsOpen(true);
    //             setIsClicked(false);
    //     } catch (e) {
    //         console.error(e)
    //         setIsError(true)
    //         setIsClicked(false);
    //         if (e.response.status === 409) {
    //             setToastText('Przedmiot z tym numerem istnieje juz w bazie')
    //         } else {
    //             setToastText('Wystąpił błąd przy dodawaniu przedmiotu do bazy')
    //         }
    //
    //     }
    // };

    return (
        <Container title={'Dodawanie przedmiotów'}>



        </Container>
    );
};

export default App;
