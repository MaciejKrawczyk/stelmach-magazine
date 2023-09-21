'use client'

import React, {useState, useCallback} from 'react';


export type UseSubmitForm<T> = (
    validationParams: FormValidation<T>,
    beforeSuccess?: (data: T) => T,
    onSuccessFunction?: (data: T) => void
) => [boolean, string | null, (e: React.FormEvent) => void];


/**
 * @typedef FormValidation
 * @property {Function} checkEmptyFields - Function to check for empty fields in the data.
 * @property {Function} validateData - Function to validate the data.
 * @property {Object} [defaultErrorMessages] - Default error messages.
 */
type FormValidation<T> = {
    checkEmptyFields: (data: T) => string[],
    validateData: (data: T) => boolean,
    defaultErrorMessages?: {
        missingFields?: string,
        genericError?: string,
        validationError?: string,
    }
};

// Default error messages
const defaultErrorMessages = {
    missingFields: 'Proszę uzupełnij brakujące pola.',
    genericError: 'Wystąpił błąd podczas dodawania.',
    validationError: 'Błąd podczas weryfikacji pól.',
};

/**
 * useSubmitForm - Custom hook to handle form submission and validation.
 *
 * @param {FormValidation} params - Form validation parameters.
 * @param {Function} beforeSuccess - Function to process data before success.
 * @param {Function} onSuccessFunction - Callback to run on successful submission.
 * @returns {[boolean, string | null, Function]} - Returns submission state, error, and handler.
 */
const useSubmitForm = (
    {
        checkEmptyFields,
        validateData,
        defaultErrorMessages: customErrorMessages = {}
    }: FormValidation<T>,
    beforeSuccess: (data: T) => T = (data) => data,  // By default, it returns the same data.
    onSuccessFunction: (data: T) => void = () => console.log('Data successfully posted!')
): [boolean, string | null, (e: React.FormEvent) => void] => {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const errorMessages = { ...defaultErrorMessages, ...customErrorMessages };

    // Function to check if form data is valid.
    const isFormValid = useCallback((data: T) => {
        const missingFields = checkEmptyFields(data);
        if (missingFields.length) {
            setError(errorMessages.missingFields);  // Set the missing fields error
            setIsSubmitting(false)
            return false;
        }
        if (!validateData(data)) {
            setError(errorMessages.validationError);  // Set the validation error
            setIsSubmitting(false)
            return false;
        }
        return true;
    }, [checkEmptyFields, validateData, errorMessages]);


    // Function to handle form submission.
    const handleSubmission = useCallback(async (data: T) => {
        setIsSubmitting(true); // It seems you missed setting this to true at the start of a submission.
        setError(null); // Reset error before starting the submission process.

        if (!isFormValid(data)) {
            setIsSubmitting(false);
            return;
        }

        try {
            const processedData = beforeSuccess(data);
            onSuccessFunction(processedData);
        } catch (err) {
            // Introduce a mechanism to ensure the error state always changes.
            setError(''); // Setting error to an empty string or any other temporary value.
            setTimeout(() => {
                setError(err.message || errorMessages.genericError);
            }, 0);
        } finally {
            setIsSubmitting(false);
        }
    }, [isFormValid, beforeSuccess, onSuccessFunction, errorMessages]);


    return [isSubmitting, error, handleSubmission];
};

export default useSubmitForm;
