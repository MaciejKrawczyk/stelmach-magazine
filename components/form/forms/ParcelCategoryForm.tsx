'use client'

// Importing required modules and types
import React, { FC, useCallback, useState, FormEvent } from 'react';
import TextInput from "@/components/form/TextInput";
import InputDivider from "@/components/form/InputDivider";
import TextAreaInput from "@/components/form/TextAreaInput";
import SubmitButton from "@/components/submitButton";
import useSubmitForm from '@/components/hooks/useSubmitForm';
import ColorPickerInput from "@/components/form/ColorPickerInput";
import SelectInput from "@/components/form/SelectInput";
import {ParcelCategory, ParcelCategorySchema} from "@/types/zod/ParcelCategory";
import ToastNotification from "@/components/form/notification/ToastNotification";
import SuccessModal from "@/components/form/modal/SuccessModal";

// Defining component props type
interface ShelfCategoryFormProps {
    name: string;
    setName: (name: string) => void;
    description: string;
    setDescription: (notes: string) => void;
    color: string,
    setColor: (color: string) => void;
    company: string,
    setCompany: (company: string) => void
    companies: any[]
}

// Component definition
const ShelfCategoryForm: FC<ShelfCategoryFormProps> = ({
    name,
    setName,
    color,
    setColor,
    setDescription,
    description,
    company,
    setCompany,
    companies,

                                                       }) => {

    // Local state to check if the form has been submitted
    const [hasBeenSubmitted, setHasBeenSubmitted] = useState<boolean>(false);
    const [lastErrorTimestamp, setLastErrorTimestamp] = useState<number | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
    const [data, setData] = useState<ParcelCategory | null>(null);

    const beforeSuccessFunction = (data: ParcelCategory): ParcelCategory => {
        console.log("Data before success:", data);
        return data; // return processed data
    };

    const onSuccessFunction = (processedData: ParcelCategory): void => {
        setData(processedData);
        console.log("Data successfully processed:", processedData);
        setShowSuccessModal(true);  // Show the SuccessModal when form is successfully submitted
    };

    // Function to check for empty fields in the form data
    const checkEmptyFields = useCallback((data: ParcelCategory): string[] => {
        return Object.keys(data).filter(key => !data[key as keyof ParcelCategory]);
    }, []);

    // Function to validate the form data
    const validateData = useCallback((data: any): boolean => {
        return ParcelCategorySchema.safeParse(data).success;
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

        // Assuming handleSubmit can extract form data by itself
        handleSubmit(e);

        // After handling submission, if there's an error, update the last error timestamp.
        if (error) {
            setLastErrorTimestamp(Date.now());
        }
    };

    return (
        <form onSubmit={formHandler}>
            <TextInput
                id={'name'}
                title={'Nazwa wysyłki'}
                value={name}
                setValue={setName}
                description={'Nazwa wysyłki lub numer, który ułatwi Tobie jej wyszukanie'}
                placeholder={'Nazwa wysyłki'}
                note={hasBeenSubmitted && checkEmptyFields({ name }).length ? 'uzupełnij brakujące pole' : ''}
            />

            <InputDivider />

            <ColorPickerInput
                title={'Kolor wysyłki'}
                color={color}
                note={''}
                setColor={setColor}
                description={'Ustaw kolor, aby dane wysyłki wyróżniały się na tle innych'}
            />

            <InputDivider />

            <SelectInput
                id={'companyId'}
                note={hasBeenSubmitted && checkEmptyFields({ company }).length ? 'uzupełnij brakujące pole' : 'Wybierz firmę z listy'}
                description={'Producent przedmiotu jest wybierany z listy wszystkich firm dodanych do bazy.'}
                title={'Producent'}
                value={company}
                setValue={setCompany}
                objectList={companies}
            />

            <InputDivider />

            <TextAreaInput
                note={hasBeenSubmitted && checkEmptyFields({ description }).length ? 'uzupełnij brakujące pole' : ''}
                value={description}
                title={'Opis wysyłki'}
                setValue={setDescription}
                description={'Opis wysyłki, ważna informacja dla obsługującego szafy'}
                id={'description'}
                placeholder={'Opis'}
            />

            <SubmitButton className={'mt-10'} isClicked={isSubmitting} />

            {error && <ToastNotification key={lastErrorTimestamp} text={error} />}
            {showSuccessModal && <SuccessModal isOpen={true} text={'udalo sie'} bigText={'udalo sie'} objectData={data} />}

        </form>
    );
}

export default ShelfCategoryForm;











