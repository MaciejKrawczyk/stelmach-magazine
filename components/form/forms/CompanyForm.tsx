'use client'

// Importing required modules and types
import React, { FC, useCallback, useState, FormEvent } from 'react';
import TextInput from "@/components/form/TextInput";
import InputDivider from "@/components/form/InputDivider";
import TextAreaInput from "@/components/form/TextAreaInput";
import SubmitButton from "@/components/submitButton";
import useSubmitForm from '@/components/hooks/useSubmitForm';
import ToastNotification from "@/components/form/notification/ToastNotification";
import SuccessModal from "@/components/form/modal/SuccessModal";
import {Company, CompanySchema} from "@/types/zod/Company";

// Defining component props type
interface ShelfCategoryFormProps {
    formData: any;
    setFormData: any;
}

// Component definition
const ShelfCategoryForm: FC<ShelfCategoryFormProps> = ({
formData, setFormData
                                                       }) => {
    // Local state to check if the form has been submitted
    const [hasBeenSubmitted, setHasBeenSubmitted] = useState<boolean>(false);
    const [lastErrorTimestamp, setLastErrorTimestamp] = useState<number | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
    const [data, setData] = useState<Company | null>(null);

    const beforeSuccessFunction = (data: Company): Company => {
        console.log("Data before success:", data);
        return data; // return processed data
    };

    const onSuccessFunction = (processedData: Company): void => {
        setData(processedData);
        console.log("Data successfully processed:", processedData);
        setShowSuccessModal(true);  // Show the SuccessModal when form is successfully submitted
    };

    // Function to check for empty fields in the form data
    const checkEmptyFields = useCallback((data: Company): string[] => {
        return Object.keys(data).filter(key => !data[key as keyof Company]);
    }, []);

    // Function to validate the form data
    const validateData = useCallback((data: any): boolean => {
        return CompanySchema.safeParse(data).success;
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
                note={hasBeenSubmitted && checkEmptyFields({ name }).length ? 'uzupełnij brakujące pole' : ''}
                placeholder={'Nazwa firmy'}
                value={formData.name}
                setValue={setName}
                title={'Nazwa firmy'}
                description={'Nazwa firmy np. producent, firma, która ostrzy, firma świadcząca jakąś usługę'}
            />

            <InputDivider />

            <TextAreaInput
                description={'Ważne informacje o firmie np. telefon kontaktowy, adres, email, opis'}
                title={'Opis przedmiotu'}
                setValue={setNotes}
                value={notes}
                note={hasBeenSubmitted && checkEmptyFields({ notes }).length ? 'uzupełnij brakujące pole' : ''}
                placeholder={'Notatki'}
                id={'notes'}
            />

            <SubmitButton className={'mt-10'} isClicked={isSubmitting} />

            {error && <ToastNotification key={lastErrorTimestamp} text={error} />}
            {showSuccessModal && <SuccessModal isOpen={true} text={'udalo sie'} bigText={'udalo sie'} objectData={data} />}

        </form>
    );
}

// Exporting the component
export default ShelfCategoryForm;











