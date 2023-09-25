'use client'

import React, {useEffect, useState} from "react";
import {Shelves} from "@/objects/Shelves";
import {Places} from "@/objects/Places";
import axios from "axios";
import SubmitButton from "@/components/submitButton";
import SuccessModal from "@/components/form/modal/SuccessModal";
import config from "@/config.json";
import shelfBig from '@/public/shelfBig.svg'
import shelfSmall from '@/public/shelfSmall.svg'
import loadingSVG from "@/public/Dual Ring-1.5s-191px.svg";
import Image from "next/image";
import ToastNotification from "@/components/form/notification/ToastNotification";
import {sortTool} from "@/utils/sortToolShelf";
import Container from "@/components/Container";
import TextInput from "@/components/form/TextInput";
import InputDivider from "@/components/form/InputDivider";
import TextAreaInput from "@/components/form/TextAreaInput";
import ItemTypeAttributesInput from "@/components/form/ItemTypeAttributesInput";
import SelectInput from "@/components/form/SelectInput";
import ItemForm from "@/components/form/forms/ItemForm";

const App = () => {

    const [formData, setFormData] = useState({
        orderCategoryId: null,
        parcelCategoryId: null,
        name: "",
        description: "",
        itemType: "",
        companyId: null,
        placeId: 1,  // Initialize placeId with the value "1"
        shelfType: "",
        shelfCategory: 1,
        shelfId: null,
        typeAttributes: {},
        isOrder: false,
        isDeleted: false,
        attributeValue: []
    });
    //
    // const [typeAttributes, setTypeAttributes] = useState([]);
    //
    // const [itemTypes, setItemTypes] = useState([]);
    // const [companyIds, setCompanyIds] = useState([]);
    // const [shelfCategories, setShelfCategories] = useState([])
    // const placeIds = Places
    // const shelfIds = Object.keys(Shelves);
    //
    // const [isLoadingTypes, setIsLoadingTypes] = useState(false)
    //
    // // submit button
    // const [isClicked, setIsClicked] = useState(false);
    // // success modal
    // const [isOpen, setIsOpen] = useState(false);
    // const [object, setObject] = useState([]);
    //
    // const [isError, setIsError] = useState(false)
    // const [toastText, setToastText] = useState('')
    //
    // const [typeAttribute, setTypeAttribute] = useState(null)
    //
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const itemTypesResponse = await axios.get('/api/itemtype');
    //             const companiesResponse = await axios.get('/api/company');
    //             const categoriesResponse = await axios.get('/api/category')
    //             // const attributesResponse = await axios.get('/api/typeattribute')
    //             console.log(itemTypesResponse.data)
    //             // setTypeAttribute(attributesResponse.data)
    //             setItemTypes(itemTypesResponse.data);
    //             setCompanyIds(companiesResponse.data);
    //             setShelfCategories(categoriesResponse.data);
    //             // console.log("Fetched shelf categories:", categoriesResponse.data); // log the fetched data
    //         } catch (error) {
    //             console.error("Error fetching data", error);
    //         }
    //     };
    //     fetchData();
    // }, []);
    //
    // // New useEffect for fetching type attributes when itemType changes
    // useEffect(() => {
    //     const fetchTypeAttributes = async () => {
    //         setIsLoadingTypes(true)
    //         try {
    //             if (formData.itemType) {  // Only fetch if itemType exists
    //                 const response = await axios.get('/api/typeattribute', {
    //                     params: {
    //                         itemtypeId: formData.itemType
    //                     }
    //                 });
    //                 setTypeAttributes(response.data);
    //             }
    //         } catch (error) {
    //             console.error("Error fetching type attributes", error);
    //         }
    //         setIsLoadingTypes(false)
    //     };
    //     fetchTypeAttributes();
    // }, [formData.itemType]);
    //
    //
    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     const newValue = value.replace(/,/g, '.');
    //     setFormData({
    //         ...formData,
    //         [name]: newValue
    //     });
    // };
    //
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
    //
    //
    //
    // const handleDivClick = (id) => {
    //     // console.log("Setting shelf type to:", id);
    //     setFormData(prevState => ({ ...prevState, shelfType: id }));
    // };
    //
    //
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //
    //
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
    //     if (areTypeAttributesEmpty) {
    //         alert("Wszystkie szczegółowe dane typu predmiotu nie mogą być puste.");
    //         return;
    //     }
    //
    //     try {
    //         console.log(formData)
    //
    //         const shelfResult = await sortTool(
    //             formData.shelfCategory,
    //             formData.shelfType,
    //             formData.itemType,
    //             formData.typeAttributes
    //         )
    //
    //         console.log('po sortowaniu')
    //
    //         setIsClicked(true);
    //         setIsOpen(false);
    //
    //         // Update formData with shelfId before sending it
    //         let updatedFormData = { ...formData, shelfId: shelfResult.shelfId };
    //
    //         console.log(updatedFormData)
    //
    //         const payload = updatedFormData;
    //
    //         try {
    //             const data = await axios.post('/api/item', payload)
    //
    //             const objectToDisplay = {
    //                 shelfName: data.data.shelf.name,
    //                 shelfId: data.data.shelf.id,
    //                 shelfType: data.data.shelf.size
    //             }
    //
    //             console.log(data)
    //             setObject(objectToDisplay);
    //             setIsOpen(true);
    //             setIsClicked(false);
    //         } catch (e) {
    //             console.error(e)
    //             setIsError(true)
    //             setIsClicked(false);
    //             if (e.response.status === 409) {
    //                 setToastText('Przedmiot z tym numerem istnieje juz w bazie')
    //             } else {
    //                 setToastText('Wystąpił błąd przy dodawaniu przedmiotu do bazy')
    //             }
    //         }
    //     } catch (e) {
    //         setToastText('Szuflada o wybranych parametrach nie znajduje się w kategorii')
    //         setIsError(true)
    //         setIsClicked(false);
    //     }
    // };



    return (<Container title={'Dodawanie przedmiotów'}>

            <ItemForm
                formData={formData}
                setFormData={setFormData}
            />

        </Container>
    );
};

export default App;
