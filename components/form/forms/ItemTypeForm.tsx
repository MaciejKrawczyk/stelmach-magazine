'use client'

// Importing required modules and types
import React, {FC, useEffect, useState} from 'react';
import TextInput from "@/components/form/TextInput";
import InputDivider from "@/components/form/InputDivider";
import SubmitButton from "@/components/form/SubmitButton";
import ToastNotification from "@/components/form/notification/ToastNotification";
import SuccessModal from "@/components/form/modal/SuccessModal";
import useFormStatus from "@/components/hooks/useFormStatus";
import {formatCommasToDots} from "@/utils/formatCommaToDots";
import {universalHandleSubmit} from "@/components/form/HandleSubmit";
import TypeValueAttributesInputItemTypeCreate from "@/components/form/TypeValueAttributesInputItemTypeCreate";
import {ItemType, ItemTypeSchema} from "@/types/zod/ItemType";

// Defining component props type
interface ItemTypeFormProps {
    formData: ItemType & { list: typeof inputList };
    setFormData: (data: ItemType & { list: typeof inputList }) => void;
}

// Component definition
const ItemTypeForm: FC<ItemTypeFormProps> = ({
                                                           formData,
                                                           setFormData
                                                       }) => {

    const [inputList, setInputList] = useState([{ value: "", disabled: false }]);

    const [lastErrorTimestamp, setLastErrorTimestamp] = useState<number | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
    const [validationError, setValidationError] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const { pending, startSubmit, finishSubmit } = useFormStatus();

    const handleChange = (e) => {
        const { name } = e.target;
        let newValue = formatCommasToDots(e.target.value)
        if (name !== 'list') {
            setFormData({
                ...formData,
                [name]: newValue,
            });
        }
    };

    useEffect(() => {
        const filteredList = inputList.filter((_, index) => index !== 0);
        setFormData((prevData) => ({
            ...prevData,
            list: filteredList,
        }));
    }, [inputList]);


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Check if formData.list is empty or undefined
        if (!formData.list || formData.list.length === 0) {
            setValidationError("Cechy typu przedmiotu nie mogą być puste"); // Display the error message in the ToastNotification
            setLastErrorTimestamp(Date.now());
            return;  // Prevent form submission
        }

        startSubmit();

        const result = await universalHandleSubmit(
            formData,
            ItemTypeSchema,
            async (data) => {
                try {
                    // This is a placeholder for the actual server submit functionality
                    // e.g., an API call.
                    // throw new Error('ciul');

                    console.log('posting...')
                    console.log('post', data)

                } catch (e) {
                    setValidationError(e.message); // Display the error message in the ToastNotification
                    throw e; // Re-throw the error so it can be caught in universalHandleSubmit
                }
            }
        );

        if (result.success) {
            setShowSuccessModal(true);
        } else {
            setLastErrorTimestamp(Date.now());
            setShowSuccessModal(false);
        }
        setFieldErrors(result.errors);
        setValidationError(result.validationError || validationError); // Use the existing validationError if result doesn't provide a new one

        finishSubmit();
    }


    return (
        <form onSubmit={handleSubmit}>

            <TextInput
                id={'name'}
                value={formData.name}
                onChange={handleChange}
                note={fieldErrors.name || ''}
                title={'Typ przedmiotu'}
                placeholder={'Nazwa typu (np. narzędzie/tulejka...'}
                description={'Typ przedmiotu - Sposób tworzenia typów jest pozostawiony użytkownikowi. Może to być np. narzędzie, tulejka etc. lub bardziej szczegółowy podział'}
            />

            <InputDivider />

            <TypeValueAttributesInputItemTypeCreate
                title={'Cechy szczególne typu przedmiotu'}
                note={'UWAGA! Zaleca się wpisywanie również jednostki w jakich będą wpisywane wartości cechy'}
                inputList={inputList}
                setInputList={setInputList}
                typeAttributePlaceholder={'Cecha typu przedmiotu'}
                description={'Są to cechy jakie trzeba będzie uzupełnić przy tworzeniu przedmiotu o danym type np. narzędzie może mieć cechy tj materiał, szerokość, wysokość, promień, a tulejka tj szerokość, wysokość itd.'}
            />

            <SubmitButton pending={pending} />

            {validationError && <ToastNotification key={lastErrorTimestamp} text={validationError} />}
            {showSuccessModal && <SuccessModal isOpen={true} text={'udalo sie'} bigText={'udalo sie'} objectData={formData} />}

        </form>

    );
}

// Exporting the component
export default ItemTypeForm;













