'use client'

// Importing required modules and types
import React, { FC, useState } from 'react';
import TextInput from "@/components/form/TextInput";
import InputDivider from "@/components/form/InputDivider";
import TextAreaInput from "@/components/form/TextAreaInput";
import SubmitButton from "@/components/form/SubmitButton";
import ColorPickerInput from "@/components/form/ColorPickerInput";
import {OrderCategory, OrderCategorySchema} from "@/types/zod/OrderCategory";
import ToastNotification from "@/components/form/notification/ToastNotification";
import SuccessModal from "@/components/form/modal/SuccessModal";
import useFormStatus from "@/components/hooks/useFormStatus";
import {formatCommasToDots} from "@/utils/formatCommaToDots";
import {universalHandleSubmit} from "@/components/form/HandleSubmit";
import {createOrder} from "@/lib/db/order/functions";
import {createOrderCategory} from "@/lib/db/orderCategory/functions";

// Defining component props type
interface OrderCategoryFormProps {
    formData: OrderCategory;
    setFormData: any;
}

// Component definition
const OrderCategoryForm: FC<OrderCategoryFormProps> = ({
    formData,
    setFormData
   }) => {

    const [lastErrorTimestamp, setLastErrorTimestamp] = useState<number | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
    const [validationError, setValidationError] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const { pending, startSubmit, finishSubmit } = useFormStatus();

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
            OrderCategorySchema,
            async (data) => {
                try {
                    // This is a placeholder for the actual server submit functionality
                    // e.g., an API call.
                    // throw new Error('ciul');

                    console.log('posting...')
                    const object = await createOrderCategory(data)
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
                note={fieldErrors.name || ''}
                value={formData.name}
                onChange={handleChange}
                description={'Nazwa zamówienia lub numer, który ułatwi Tobie wyszukanie zamówienia'}
                placeholder={'Nazwa zamówienia'}
                title={'Nazwa zamówienia'}
            />

            <InputDivider />

            <ColorPickerInput
                value={formData.color}
                title='Kolor kategorii'
                note={fieldErrors.color || ''}
                onChange={handleChange}
                description='Ustaw kolor, który ułatwi wizualne rozpoznanie szuflad w kategorii'
            />

            <InputDivider />

            <TextAreaInput
                note={fieldErrors.description || ''}
                title={'Opis zamówienia'}
                description={'Opis zamówienia, ważna informacja dla obsługującego szafy'}
                placeholder={'Opis'}
                value={formData.description}
                onChange={handleChange}
                id={'description'}
            />

            <SubmitButton pending={pending} />

            {validationError && <ToastNotification key={lastErrorTimestamp} text={validationError} />}
            {showSuccessModal && <SuccessModal isOpen={true} text={'udalo sie'} bigText={'udalo sie'} objectData={formData} />}

        </form>

    );
}

// Exporting the component
export default OrderCategoryForm;











