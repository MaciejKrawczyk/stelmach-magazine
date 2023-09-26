'use client'

import React, {FC, useState, useEffect} from 'react';
import InputDivider from "@/components/form/InputDivider";
import TextAreaInput from "@/components/form/TextAreaInput";
import SubmitButton from "@/components/form/SubmitButton";
import ToastNotification from "@/components/form/notification/ToastNotification";
import SuccessModal from "@/components/form/modal/SuccessModal";
import SelectInput from "@/components/form/SelectInput";
import NumberInput from "@/components/form/NumberInput";
import ItemTypeAttributesInput from "@/components/form/ItemTypeAttributesInput";
import {Places} from "@/objects/Places";
import axios from "axios";
import {formatCommasToDots} from "@/utils/formatCommaToDots";
import useFormStatus from "@/components/hooks/useFormStatus";
import {universalHandleSubmit} from "@/components/form/HandleSubmit";
import {OrderSchema} from "@/types/zod/Order";
import {createOrder} from "@/lib/db/order/functions";

interface OrderFormProps {
    formData: any
    setFormData: any
}

// Component definition
const OrderForm: FC<OrderFormProps> = ({
    formData,
    setFormData
   }) => {

    const [lastErrorTimestamp, setLastErrorTimestamp] = useState<number | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
    const [validationError, setValidationError] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [typeAttributes, setTypeAttributes] = useState([]);
    const [companyIds, setCompanyIds] = useState([]);
    const [orderCategories, setOrderCategories] = useState([])

    const { pending, startSubmit, finishSubmit } = useFormStatus();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const companiesResponse = await axios.get('/api/company');
                const orderCategoriesResponse = await axios.get('/api/orderCategory')
                setCompanyIds(companiesResponse.data);
                setOrderCategories(orderCategoriesResponse.data)
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchData();
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
            OrderSchema,
            async (data) => {
                try {
                    // This is a placeholder for the actual server submit functionality
                    // e.g., an API call.
                    // throw new Error('ciul');
                    console.log('posting...')

                    const object = await createOrder(data)

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

            <SelectInput
                id={'orderCategoryId'}
                value={formData.orderCategoryId}
                onChange={handleChange}
                description={'Zamówienie, które jest tworzone w dodaj zamówienie. W tym wybranym zamówieniu będą się znajdować zamówione tutaj narzędzia'}
                title={'Zamówienie'}
                note={'Wybierz zamówienie z listy'}
                objectList={orderCategories}
            />

            <InputDivider />

            <NumberInput
                note={fieldErrors.quantity || 'Wybierz ilość narzędzi tego typu, które zostaną dodane do zamówienia'}
                title={'Ilość'}
                value={formData.quantity}
                onChange={handleChange}
                description={'Wpisz ilość przedmiotów tego samego typu, które zamawiasz.'}
                id={'quantity'}
            />

            <InputDivider />

            <TextAreaInput
                id={'description'}
                title={'Opis przedmiotu'}
                value={formData.description}
                onChange={handleChange}
                description={'Opis jest dla Ciebie - cechy szczególne, ważne dodatkowe informacje'}
                note={fieldErrors.description || ''}
                placeholder={'Opis'}
            />

            <InputDivider />

            <ItemTypeAttributesInput
                description={'Typ przedmiotu - dodawany w dodaj -> dodaj typ przedmiotów. Sposób tworzenia typów jest pozostawiony użytkownikowi.'}
                note={fieldErrors.itemType || 'Wybierz typ z listy, UWAGA! wpisywać wartości bez spacji i jednostek, aby algorytm odpowiednio segregował przedmoty'}
                title={'Typ przedmiotu'}
                id={'itemType'}
                formData={formData}
                setFormData={setFormData}
            />

            <InputDivider />


            <SelectInput
                id={'companyId'}
                title={'Producent'}
                note={fieldErrors.companyId || 'Wybierz producenta z listy'}
                value={formData.companyId}
                onChange={handleChange}
                description={'Producent przedmiotu jest wybierany z listy wszystkich firm dodanych do bazy.'}
                objectList={companyIds}
            />

            <InputDivider />

            <SelectInput
                id={'placeId'}
                title={'Miejsce docelowe przedmiotu'}
                note={fieldErrors.placeId || 'Domyślna opcja - nie można jej zmienić'}
                value={formData.placeId}
                onChange={handleChange}
                objectList={Places}
                description={'Jest to zamówiony przedmiot, trafi on do listy zamówionych'}
                enabledOptions={[18]}
            />

            <SubmitButton pending={pending} />

            {validationError && <ToastNotification key={lastErrorTimestamp} text={validationError} />}
            {showSuccessModal && <SuccessModal isOpen={true} text={'udalo sie'} bigText={'udalo sie'} objectData={formData} />}

        </form>

    );
}

// Exporting the component
export default OrderForm;











