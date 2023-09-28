'use client'

import React, { useState } from 'react';
import TextInput from "@/components/form/TextInput";
import InputDivider from "@/components/form/InputDivider";
import TextAreaInput from "@/components/form/TextAreaInput";
import SubmitButton from "@/components/form/SubmitButton";
import ColorPickerInput from "@/components/form/ColorPickerInput";
import {OrderCategory, OrderCategorySchema} from "@/types/zod/OrderCategory";
import ToastNotification from "@/components/form/notification/ToastNotification";
import SuccessModal from "@/components/form/modal/SuccessModal";
import {FieldValues, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";


const OrderCategoryForm = () => {

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
    } = useForm<OrderCategory>({
        resolver: zodResolver(OrderCategorySchema),
    })

    const onSubmit = async (data: FieldValues) => {
        try {
            setShowErrorModal(false)
            setErrorMessage('')
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log(data)
            setShowSuccessModal(true);
            setFormData(data);
        } catch (error) {

            setShowErrorModal(true);
            setErrorMessage(error.message || 'Something went wrong!');
        } finally {
            reset();
        }
    };

    // @ts-ignore
    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
        >
            <TextInput
                {...register('name')}
                note={errors.name && `${errors.name.message}` || ''}
                description={'Nazwa zamówienia lub numer, który ułatwi Tobie wyszukanie zamówienia'}
                placeholder={'Nazwa zamówienia'}
                title={'Nazwa zamówienia'}
            />
            <InputDivider />
            <ColorPickerInput
                name={'color'}
                defaultValue={"#FF33FF"}
                title='Kolor kategorii'
                control={control}
                note={errors.color && `${errors.color.message}` || ''}
                description='Ustaw kolor, który ułatwi wizualne rozpoznanie szuflad w kategorii'
            />
            <InputDivider />
            <TextAreaInput
                {...register('description')}
                note={errors.description && `${errors.description.message}` || ''}
                title={'Opis zamówienia'}
                description={'Opis zamówienia, ważna informacja dla obsługującego szafy'}
                placeholder={'Opis'}
            />

            <SubmitButton pending={isSubmitting} />

            {showErrorModal && <ToastNotification key={Date.now()} text={errorMessage} />}
            {showSuccessModal && <SuccessModal isOpen={true} text={'Success!'} bigText={'Success!'} objectData={formData} />}

        </form>

    );
}

// Exporting the component
export default OrderCategoryForm;











