'use client'

// Importing required modules and types
import React, { FC, useCallback, useState } from 'react';
import TextInput from "@/components/form/TextInput";
import InputDivider from "@/components/form/InputDivider";
import ColorPickerInput from "@/components/form/ColorPickerInput";
import TextAreaInput from "@/components/form/TextAreaInput";
import SubmitButton from "@/components/submitButton";
import ToastNotification from "@/components/form/notification/ToastNotification";
import { ShelfCategorySchema } from "@/types/zod/Shelf";
import useSubmitForm from '@/components/hooks/useSubmitForm';

// Defining component props type
interface ShelfCategoryFormProps {
    name: string;
    setName: (name: string) => void;
    color: string;
    setColor: (color: string) => void;
    notes: string;
    setNotes: (notes: string) => void;
}

// Component definition
const ShelfCategoryForm: FC<ShelfCategoryFormProps> = ({
                                                           name,
                                                           setName,
                                                           color,
                                                           setColor,
                                                           notes,
                                                           setNotes,
                                                       }) => {

    // Local state to check if the form has been submitted
    const [hasBeenSubmitted, setHasBeenSubmitted] = useState(false);

    const beforeSuccessFunction = (data: ShelfCategorySchema) => {
        console.log("Data before success:", data);
        return data; // return processed data
    };

    const onSuccessFunction = (processedData: ShelfCategorySchema) => {
        console.log("Data successfully processed:", processedData);
    };


    // Function to check for empty fields in the form data
    const checkEmptyFields = useCallback((data: any) => {
        return Object.keys(data).filter(key => !data[key]);
    }, []);

    // Function to validate the form data
    const validateData = useCallback((data: any) => {
        return ShelfCategorySchema.safeParse(data).success;
    }, []);

    // Using the custom hook to manage form submission and validation
    const [isSubmitting, error, handleSubmit] = useSubmitForm({
        checkEmptyFields,
        validateData,
        // optional custom error messges
    }, beforeSuccessFunction, onSuccessFunction);


    // Handler for form submission
    const formHandler = (e: React.FormEvent) => {
        e.preventDefault();
        setHasBeenSubmitted(true);
        handleSubmit({ name, color, notes });
    };


    return (
        <form onSubmit={formHandler}>
            <TextInput
                id='name'
                description='Nazwa kategorii, która ma ułatwić segregowanie przedmiotów w szafie'
                placeholder='nazwa kategorii'
                note={hasBeenSubmitted && checkEmptyFields({ name }).length ? 'uzupełnij brakujące pole' : ''}
                value={name}
                setValue={setName}
                title='Nazwa kategorii'
            />
            <InputDivider />
            <ColorPickerInput
                title='Kolor kategorii'
                color={color}
                note={hasBeenSubmitted && checkEmptyFields({ color }).length ? 'uzupełnij brakujące pole' : ''}
                setColor={setColor}
                description='Ustaw kolor, który ułatwi wizualne rozpoznanie szuflad w kategorii'
            />
            <InputDivider />
            <TextAreaInput
                note={hasBeenSubmitted && checkEmptyFields({ notes }).length ? 'uzupełnij brakujące pole' : ''}
                description='Opis kategorii, ważna informacja dla obsługującego szafy'
                title='Opis kategorii'
                setValue={setNotes}
                value={notes}
                placeholder='Notatki'
                id='notes'
            />
            <SubmitButton className='mt-10' isClicked={isSubmitting} />

            {error && <ToastNotification text={error} />}
        </form>
    );
}

// Exporting the component
export default ShelfCategoryForm;
