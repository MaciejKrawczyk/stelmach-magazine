import React, { useState } from 'react';
import TextInput from "@/components/form/TextInput";
import InputDivider from "@/components/form/InputDivider";
import TextAreaInput from "@/components/form/TextAreaInput";
import SubmitButton from "@/components/form/SubmitButton";
import {Company, CompanySchema} from "@/types/zod/Company";
import ToastNotification from "@/components/form/notification/ToastNotification";
import SuccessModal from "@/components/form/modal/SuccessModal";
import {createCompany} from "@/lib/db/company/functions";
import {FieldValues, useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const CompanyForm = () => {

    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState({});

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<Company>({
        resolver: zodResolver(CompanySchema)
    })

    const onSubmit = async (data: FieldValues) => {
        try {
            setShowErrorModal(false)
            setErrorMessage('')

            await new Promise((resolve) => setTimeout(resolve, 1000));

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
                    {...register('name', )}
                    note={errors.name && `${errors.name.message}` || ''}
                    placeholder={'Nazwa firmy'}
                    title={'Nazwa firmy'}
                    description={'Nazwa firmy np. producent, firma, która ostrzy, firma świadcząca jakąś usługę'}
                />
                <InputDivider />
                <TextAreaInput
                    {...register('notes', )}
                    description={'Ważne informacje o firmie np. telefon kontaktowy, adres, email, opis'}
                    title={'Opis przedmiotu'}
                    note={errors.notes && `${errors.notes.message}` || ''}
                    placeholder={'Notatki'}
                />
                <SubmitButton pending={isSubmitting} />

                {showErrorModal && <ToastNotification key={Date.now()} text={errorMessage} />}
                {showSuccessModal && <SuccessModal isOpen={true} text={'Success!'} bigText={'Success!'} objectData={formData} />}
            </form>
    );
}

export default CompanyForm;