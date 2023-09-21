'use client'

// Importing required modules and types
import React, { FC, useCallback, useState, FormEvent } from 'react';
import InputDivider from "@/components/form/InputDivider";
import TextAreaInput from "@/components/form/TextAreaInput";
import SubmitButton from "@/components/submitButton";
import useSubmitForm from '@/components/hooks/useSubmitForm';
import ToastNotification from "@/components/form/notification/ToastNotification";
import SuccessModal from "@/components/form/modal/SuccessModal";
import SelectInput from "@/components/form/SelectInput";
import NumberInput from "@/components/form/NumberInput";
import ItemTypeAttributesInput from "@/components/form/ItemTypeAttributesInput";
import {Places} from "@/objects/Places";
import {Order, OrderSchema} from "@/types/zod/Order";

// Defining component props type
interface OrderCategoryFormProps {
    formData: any
    setFormData: any
}

// Component definition
const OrderCategoryForm: FC<OrderCategoryFormProps> = ({
    formData,
    setFormData
                                                       }) => {

    // Local state to check if the form has been submitted
    const [hasBeenSubmitted, setHasBeenSubmitted] = useState<boolean>(false);
    const [lastErrorTimestamp, setLastErrorTimestamp] = useState<number | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
    const [data, setData] = useState<OrderCategory | null>(null);

    const beforeSuccessFunction = (data: Order): Order => {
        console.log("Data before success:", data);
        return data; // return processed data
    };

    const onSuccessFunction = (processedData: Order): void => {
        setData(processedData);
        console.log("Data successfully processed:", processedData);
        setShowSuccessModal(true);  // Show the SuccessModal when form is successfully submitted
    };

    // Function to check for empty fields in the form data
    const checkEmptyFields = useCallback((data: Order): string[] => {
        return Object.keys(data).filter(key => !data[key as keyof Order]);
    }, []);

    // Function to validate the form data
    const validateData = useCallback((data: any): boolean => {
        return OrderSchema.safeParse(data).success;
    }, []);

    // Using the custom hook to manage form submission and validation
    const [isSubmitting, error, handleSubmit] = useSubmitForm({
        checkEmptyFields,
        validateData,
        // optional custom error messges
    }, beforeSuccessFunction, onSuccessFunction);

    // Handler for form submission
    const formHandler = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        setHasBeenSubmitted(true);
        handleSubmit({ formData });

        // After handling submission, if there's an error, update the last error timestamp.
        if (error) {
            setLastErrorTimestamp(Date.now());
        }
    };

    return (

        <form onSubmit={formHandler}>

            <SelectInput
                id={'orderCategoryId'}
                value={formData.orderCategoryId}
                setValue={handleChange}
                description={'Zamówienie, które jest tworzone w dodaj zamówienie. W tym wybranym zamówieniu będą się znajdować zamówione tutaj narzędzia'}
                title={'Zamówienie'}
                note={'Wybierz zamówienie z listy'}
                objectList={orderCategories}
            />

            <InputDivider />

            <NumberInput
                note={'Wybierz ilość narzędzi tego typu, które zostaną dodane do zamówienia'}
                title={'Ilość'}
                value={formData.quantity}
                setValue={handleChange}
                description={'Wpisz ilość przedmiotów tego samego typu, które zamawiasz.'}
                id={'quantity'}
            />

            <InputDivider />

            <TextAreaInput
                id={'description'}
                title={'Opis przedmiotu'}
                value={formData.description}
                setValue={handleChange}
                description={'Opis jest dla Ciebie - cechy szczególne, ważne dodatkowe informacje'}
                note={''}
                placeholder={'Opis'}
            />

            <InputDivider />

            <ItemTypeAttributesInput
                description={'Typ przedmiotu - dodawany w dodaj -> dodaj typ przedmiotów. Sposób tworzenia typów jest pozostawiony użytkownikowi.'}
                note={'Wybierz typ z listy, UWAGA! wpisywać wartości bez spacji i jednostek, aby algorytm odpowiednio segregował przedmoty'}
                title={'Typ przedmiotu'}
                id={'itemType'}
                formData={formData}
                setFormData={setFormData}
            />

            <InputDivider />


            <SelectInput
                id={'companyId'}
                title={'Producent'}
                note={'Wybierz producenta z listy'}
                value={formData.companyId}
                setValue={handleChange}
                description={'Producent przedmiotu jest wybierany z listy wszystkich firm dodanych do bazy.'}
                objectList={companyIds}
            />

            <InputDivider />

            <SelectInput
                id={'placeId'}
                title={'Miejsce docelowe przedmiotu'}
                note={'Domyślna opcja - nie można jej zmienić'}
                value={formData.placeId}
                setValue={handleChange}
                objectList={Places}
                description={'Jest to zamówiony przedmiot, trafi on do listy zamówionych'}
            />

            <SubmitButton className={'mt-10'} isClicked={isSubmitting} />

            {error && <ToastNotification key={lastErrorTimestamp} text={error} />}
            {showSuccessModal && <SuccessModal isOpen={true} text={'udalo sie'} bigText={'udalo sie'} objectData={data} />}

        </form>

    );
}

// Exporting the component
export default OrderCategoryForm;











