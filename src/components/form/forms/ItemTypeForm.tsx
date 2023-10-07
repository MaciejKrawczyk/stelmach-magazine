import React, {useState} from 'react';
import TextInput from "@/src/components/form/TextInput";
import InputDivider from "@/src/components/form/InputDivider";
import SubmitButton from "@/src/components/form/SubmitButton";
import ToastNotification from "@/src/components/form/notification/ToastNotification";
import SuccessModal from "@/src/components/form/modal/SuccessModal";
import {FieldValues, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import ListInput from "@/src/components/form/ListInput";
import {ItemType, ItemTypeSchema} from "@/src/types/zod/ItemType";
import axios from "axios";
import FormEnding from "@/src/components/form/FormEnding";

const ItemTypeForm = () => {
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState({});

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<ItemType>({
        resolver: zodResolver(ItemTypeSchema),
    });

    const onSubmit = async (data: FieldValues) => {

        try {
            setShowErrorModal(false);
            setErrorMessage('');

            const object = await axios.post('/api/item-type', data)
            console.log(data)
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

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <TextInput
                {...register('name')}
                note={errors.name && `${errors.name.message}` || ''}
                title={'Typ przedmiotu'}
                placeholder={'Nazwa typu (np. narzędzie/tulejka...'}
                description={'Typ przedmiotu - Sposób tworzenia typów jest pozostawiony użytkownikowi. Może to być np. narzędzie, tulejka etc. lub bardziej szczegółowy podział'}
            />

            <InputDivider />

            <ListInput
                name="list"
                title="Cechy szczególne typu przedmiotu"
                placeholder="Cecha typu przedmiotu"
                description="Są to cechy jakie trzeba będzie uzupełnić przy tworzeniu przedmiotu o danym type np. narzędzie może mieć cechy tj materiał, szerokość, wysokość, promień, a tulejka tj szerokość, wysokość itd."
                note={errors.list && errors.list.message ? errors.list.message : 'UWAGA! Zaleca się wpisywanie również jednostki w jakich będą wpisywane wartości cechy'}
                onItemsChange={(items) => setValue('list', items)}
            />

            <FormEnding />

            <SubmitButton pending={isSubmitting} />

            {showErrorModal && <ToastNotification key={Date.now()} text={errorMessage} />}
            {showSuccessModal && <SuccessModal isOpen={true} text={'Success!'} bigText={'Success!'} objectData={formData} />}
        </form>
    );
}

export default ItemTypeForm;
