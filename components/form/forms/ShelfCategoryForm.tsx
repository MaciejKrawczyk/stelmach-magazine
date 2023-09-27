import React, { useState } from 'react';
import TextInput from "@/components/form/TextInput";
import InputDivider from "@/components/form/InputDivider";
import ColorPickerInput from "@/components/form/ColorPickerInput";
import TextAreaInput from "@/components/form/TextAreaInput";
import SubmitButton from "@/components/form/SubmitButton";
import ToastNotification from "@/components/form/notification/ToastNotification";
import SuccessModal from "@/components/form/modal/SuccessModal";
import {ShelfCategory, ShelfCategorySchema} from "@/types/zod/Shelf";
import {FieldValues, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";


const ShelfCategoryForm = () => {

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
    } = useForm<ShelfCategory>({
        resolver: zodResolver(ShelfCategorySchema)
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

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
        >
            <TextInput
                {...register('name')}
                description='Nazwa kategorii, która ma ułatwić segregowanie przedmiotów w szafie'
                placeholder='nazwa kategorii'
                note={errors.name && `${errors.name.message}` || ''}
                title='Nazwa kategorii'
            />

            <InputDivider />

            <ColorPickerInput
                defaultValue={"#FF33FF"}
                name={'color'}
                control={control}
                title='Kolor kategorii'
                note={errors.color && `${errors.color.message}` || ''}
                description='Ustaw kolor, który ułatwi wizualne rozpoznanie szuflad w kategorii'
            />

            <InputDivider />

            <TextAreaInput
                {...register('notes')}
                note={errors.notes && `${errors.notes.message}` || ''}
                description='Opis kategorii, ważna informacja dla obsługującego szafy'
                title='Opis kategorii'
                placeholder='Notatki'
            />

            <SubmitButton pending={isSubmitting} />

            {showErrorModal && <ToastNotification key={Date.now()} text={errorMessage} />}
            {showSuccessModal && <SuccessModal isOpen={true} text={'Success!'} bigText={'Success!'} objectData={formData} />}

        </form>
    );
}

export default ShelfCategoryForm;
