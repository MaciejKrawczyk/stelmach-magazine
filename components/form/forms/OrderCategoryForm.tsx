'use client'

// Importing required modules and types
import React, { FC, useCallback, useState, FormEvent } from 'react';
import TextInput from "@/components/form/TextInput";
import InputDivider from "@/components/form/InputDivider";
import TextAreaInput from "@/components/form/TextAreaInput";
import SubmitButton from "@/components/submitButton";
import useSubmitForm from '@/components/hooks/useSubmitForm';
import ColorPickerInput from "@/components/form/ColorPickerInput";
import {OrderCategory, OrderCategorySchema} from "@/types/zod/OrderCategory";
import ToastNotification from "@/components/form/notification/ToastNotification";
import SuccessModal from "@/components/form/modal/SuccessModal";

// Defining component props type
interface OrderCategoryFormProps {
    name: string;
    setName: (name: string) => void;
    description: string;
    setDescription: (notes: string) => void;
    color: string
    setColor: (color: string) => void;
}

// Component definition
const OrderCategoryForm: FC<OrderCategoryFormProps> = ({
    name,
    setName,
    description,
    setDescription,
    color,
    setColor
                                                       }) => {

    // Local state to check if the form has been submitted
    const [hasBeenSubmitted, setHasBeenSubmitted] = useState<boolean>(false);
    const [lastErrorTimestamp, setLastErrorTimestamp] = useState<number | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
    const [data, setData] = useState<OrderCategory | null>(null);

    const beforeSuccessFunction = (data: OrderCategory): OrderCategory => {
        console.log("Data before success:", data);
        return data; // return processed data
    };

    const onSuccessFunction = (processedData: OrderCategory): void => {
        setData(processedData);
        console.log("Data successfully processed:", processedData);
        setShowSuccessModal(true);  // Show the SuccessModal when form is successfully submitted
    };

    // Function to check for empty fields in the form data
    const checkEmptyFields = useCallback((data: OrderCategory): string[] => {
        return Object.keys(data).filter(key => !data[key as keyof OrderCategory]);
    }, []);

    // Function to validate the form data
    const validateData = useCallback((data: any): boolean => {
        return OrderCategorySchema.safeParse(data).success;
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
        handleSubmit({ name, color, description });

        // After handling submission, if there's an error, update the last error timestamp.
        if (error) {
            setLastErrorTimestamp(Date.now());
        }
    };

    return (
        <form onSubmit={formHandler}>

            <TextInput
                id={'name'}
                note={hasBeenSubmitted && checkEmptyFields({ name }).length ? 'uzupełnij brakujące pole' : ''}
                value={name}
                setValue={setName}
                description={'Nazwa zamówienia lub numer, który ułatwi Tobie wyszukanie zamówienia'}
                placeholder={'Nazwa zamówienia'}
                title={'Nazwa zamówienia'}
            />

            <InputDivider />

            <ColorPickerInput
                title={'Kolor zamówienia'}
                color={color}
                setColor={setColor}
                note={''}
                description={'Ustaw kolor, aby dane zamówienie wyróżniało się na tle innych'}
            />

            <InputDivider />

            <TextAreaInput
                note={hasBeenSubmitted && checkEmptyFields({ description }).length ? 'uzupełnij brakujące pole' : ''}
                title={'Opis zamówienia'}
                description={'Opis zamówienia, ważna informacja dla obsługującego szafy'}
                placeholder={'Opis'}
                value={description}
                setValue={setDescription}
                id={'description'}
            />

            <SubmitButton className={'mt-10'} isClicked={isSubmitting} />

            {error && <ToastNotification key={lastErrorTimestamp} text={error} />}
            {showSuccessModal && <SuccessModal isOpen={true} text={'udalo sie'} bigText={'udalo sie'} objectData={data} />}

        </form>

    );
}

// Exporting the component
export default OrderCategoryForm;











