'use client'

// Importing required modules and types
import React, {FC, useState, useEffect} from 'react';
import TextInput from "@/components/form/TextInput";
import InputDivider from "@/components/form/InputDivider";
import TextAreaInput from "@/components/form/TextAreaInput";
import SubmitButton from "@/components/form/SubmitButton";
import ColorPickerInput from "@/components/form/ColorPickerInput";
import SelectInput from "@/components/form/SelectInput";
import {ParcelCategory, ParcelCategorySchema} from "@/types/zod/ParcelCategory";
import ToastNotification from "@/components/form/notification/ToastNotification";
import SuccessModal from "@/components/form/modal/SuccessModal";
import {formatCommasToDots} from "@/utils/formatCommaToDots";
import {universalHandleSubmit} from "@/components/form/HandleSubmit";
import useFormStatus from "@/components/hooks/useFormStatus";
import axios from "axios";
import {createParcelCategory} from "@/lib/db/parcelCategory/functions";

// Defining component props type
interface ParcelCategoryFormProps {
    formData: ParcelCategory,
    setFormData: any;
}

// Component definition
const ParcelCategoryForm: FC<ParcelCategoryFormProps> = ({
    formData,
    setFormData
                                                       }) => {

    // Local state to check if the form has been submitted
    const [lastErrorTimestamp, setLastErrorTimestamp] = useState<number | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
    const [validationError, setValidationError] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const { pending, startSubmit, finishSubmit } = useFormStatus();


    const [company, setCompany] = useState('')

    const [companies, setCompanies] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const companiesResponse = await axios.get('/api/company');
                setCompanies(companiesResponse.data);

                if (companiesResponse.data.length) {
                    setFormData(prevData => ({ ...prevData, companyId: companiesResponse.data[0].id }));
                }

            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchData();

        console.log(companies)
    }, []);


    const handleChange = (e) => {
        const { name } = e.target;
        let newValue = formatCommasToDots(e.target.value)
        setFormData({
            ...formData,
            [name]: newValue,
        });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        startSubmit();

        const result = await universalHandleSubmit(
            formData,
            ParcelCategorySchema,
            async (data) => {
                try {
                    // This is a placeholder for the actual server submit functionality
                    // e.g., an API call.
                    // throw new Error('ciul');

                    console.log('posting...')

                    const object = await createParcelCategory(data)

                    console.log('post', object)

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
                title={'Nazwa wysyłki'}
                value={formData.name}
                onChange={handleChange}
                description={'Nazwa wysyłki lub numer, który ułatwi Tobie jej wyszukanie'}
                placeholder={'Nazwa wysyłki'}
                note={fieldErrors.name || ''}
            />

            <InputDivider />

            <ColorPickerInput
                title={'Kolor wysyłki'}
                value={formData.color}
                note={fieldErrors.color || ''}
                onChange={handleChange}
                description={'Ustaw kolor, aby dane wysyłki wyróżniały się na tle innych'}
            />

            <InputDivider />

            <SelectInput
                id={'companyId'}
                note={fieldErrors.companyId || ''}
                description={'Producent przedmiotu jest wybierany z listy wszystkich firm dodanych do bazy.'}
                title={'Producent'}
                value={formData.companyId}
                onChange={handleChange}
                objectList={companies}
            />

            <InputDivider />

            <TextAreaInput
                note={fieldErrors.description || ''}
                value={formData.description}
                title={'Opis wysyłki'}
                onChange={handleChange}
                description={'Opis wysyłki, ważna informacja dla obsługującego szafy'}
                id={'description'}
                placeholder={'Opis'}
            />

            <SubmitButton pending={pending} />

            {validationError && <ToastNotification key={lastErrorTimestamp} text={validationError} />}
            {showSuccessModal && <SuccessModal isOpen={true} text={'udalo sie'} bigText={'udalo sie'} objectData={formData} />}

        </form>
    );
}

export default ParcelCategoryForm;











