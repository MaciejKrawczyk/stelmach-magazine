'use client'

import React, {useState} from 'react';
import TextInput from "@/components/form/TextInput";
import InputDivider from "@/components/form/InputDivider";
import TextAreaInput from "@/components/form/TextAreaInput";
import SubmitButton from "@/components/form/SubmitButton";
import ColorPickerInput from "@/components/form/ColorPickerInput";
import SelectInput from "@/components/form/SelectInput";
import ToastNotification from "@/components/form/notification/ToastNotification";
import SuccessModal from "@/components/form/modal/SuccessModal";
import {FieldValues, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {ParcelCategory, ParcelCategorySchema} from "@/types/zod/ParcelCategory";
import {useCompanies} from "@/components/hooks/useCompanies";
import Image from "next/image";
import loadingSVG from "@/public/Dual Ring-1.5s-191px.svg";
import axios from "axios";
import FormEnding from "@/components/form/FormEnding";


const ParcelCategoryForm = () => {

    const { companies, loading, error } = useCompanies()

    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState({});

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<ParcelCategory>({
        resolver: zodResolver(ParcelCategorySchema),
    })

    const onSubmit = async (data: FieldValues) => {
        try {
            setShowErrorModal(false)
            setErrorMessage('')

            const object = await axios.post('/api/parcel-category', data)

            setShowSuccessModal(true);
            setFormData(object.data);
        } catch (error) {
            if (error instanceof Error) {
                setShowErrorModal(true);
                setErrorMessage(error.message || 'Something went wrong!');
            } else {
                setShowErrorModal(true);
                setErrorMessage('Something went wrong!');
            }
        } finally {
            reset();
        }
    };

    // Render a loading indicator when fetching data
    if (loading) return <div className="flex justify-center items-center min-h-screen">
        <Image priority alt={'loading...'} src={loadingSVG} />
    </div>

    // Render an error message if there's an error fetching companies
    if (error) return <p>Error: {error.message}</p>;

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
        >
            <TextInput
                {...register('name')}
                title={'Nazwa wysyłki'}
                description={'Nazwa wysyłki lub numer, który ułatwi Tobie jej wyszukanie'}
                placeholder={'Nazwa wysyłki'}
                note={errors.name && `${errors.name.message}` || ''}
            />

            <InputDivider />

            <ColorPickerInput
                defaultValue={"#FF33FF"}
                name={'color'}
                control={control}
                title='Kolor wysyłki'
                note={errors.color && `${errors.color.message}` || ''}
                description='Ustaw kolor, aby dane wysyłki wyróżniały się na tle innych'
            />

            <InputDivider />

            <SelectInput
                control={control}
                id={"companyId"}
                note={errors.companyId && `${errors.companyId.message}` || ''}
                description={'Producent przedmiotu jest wybierany z listy wszystkich firm dodanych do bazy.'}
                title={'Producent'}
                objectList={companies}
            />

            <InputDivider />

            <TextAreaInput
                {...register('description')}
                note={errors.description && `${errors.description.message}` || ''}
                title={'Opis wysyłki'}
                description={'Opis wysyłki, ważna informacja dla obsługującego szafy'}
                placeholder={'Opis'}
            />

            <FormEnding />

            <SubmitButton pending={isSubmitting} />

            {showErrorModal && <ToastNotification key={Date.now()} text={errorMessage} />}
            {showSuccessModal && <SuccessModal isOpen={true} text={'Success!'} bigText={'Success!'} objectData={formData} />}

        </form>
    );
}

export default ParcelCategoryForm;











