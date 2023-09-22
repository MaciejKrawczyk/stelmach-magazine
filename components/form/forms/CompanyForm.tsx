import React, { FC, useState} from 'react';
import TextInput from "@/components/form/TextInput";
import InputDivider from "@/components/form/InputDivider";
import TextAreaInput from "@/components/form/TextAreaInput";
import SubmitButton from "@/components/form/SubmitButton";
import {formatCommasToDots} from "@/utils/formatCommaToDots";
import useFormStatus from "@/components/hooks/useFormStatus";
import {Company, CompanySchema} from "@/types/zod/Company";
import ToastNotification from "@/components/form/notification/ToastNotification";
import SuccessModal from "@/components/form/modal/SuccessModal";
import {universalHandleSubmit} from "@/components/form/HandleSubmit";
import {ShelfCategorySchema} from "@/types/zod/Shelf";



interface CompanyFormProps {
    formData: Company;
    setFormData: any;
}


const CompanyForm: FC<CompanyFormProps> = ({
    formData, setFormData
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
            CompanySchema,
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
                    note={fieldErrors.name || ''}
                    placeholder={'Nazwa firmy'}
                    value={formData.name}
                    onChange={handleChange}
                    title={'Nazwa firmy'}
                    description={'Nazwa firmy np. producent, firma, która ostrzy, firma świadcząca jakąś usługę'}
                />

                <InputDivider />

                <TextAreaInput
                    description={'Ważne informacje o firmie np. telefon kontaktowy, adres, email, opis'}
                    title={'Opis przedmiotu'}
                    onChange={handleChange}
                    value={formData.notes}
                    note={fieldErrors.notes || ''}
                    placeholder={'Notatki'}
                    id={'notes'}
                />

                <SubmitButton pending={pending} />

                {validationError && <ToastNotification key={lastErrorTimestamp} text={validationError} />}
                {showSuccessModal && <SuccessModal isOpen={true} text={'udalo sie'} bigText={'udalo sie'} objectData={formData} />}

            </form>

    );
}

// Exporting the component
export default CompanyForm;

