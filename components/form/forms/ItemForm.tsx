'use client'

// Importing required modules and types
import React, {FC, useEffect, useState} from 'react';
import TextInput from "@/components/form/TextInput";
import InputDivider from "@/components/form/InputDivider";
import TextAreaInput from "@/components/form/TextAreaInput";
import SubmitButton from "@/components/form/SubmitButton";
import ToastNotification from "@/components/form/notification/ToastNotification";
import SuccessModal from "@/components/form/modal/SuccessModal";
import useFormStatus from "@/components/hooks/useFormStatus";
import {formatCommasToDots} from "@/utils/formatCommaToDots";
import {universalHandleSubmit} from "@/components/form/HandleSubmit";
import ItemTypeAttributesInput from "@/components/form/ItemTypeAttributesInput";
import SelectInput from "@/components/form/SelectInput";
import {Places} from "@/objects/Places";
import Image from "next/image";
import shelfSmall from "@/public/shelfSmall.svg";
import shelfBig from "@/public/shelfBig.svg";
import {Item, ItemSchema} from "@/types/zod/Item";
import axios from "axios";
import {Shelves} from "@/objects/Shelves";
import {createItem} from "@/lib/db/item/functions";
import {sortTool} from "@/utils/sortToolShelf";

// Defining component props type
interface ItemFormProps {
    formData: Item;
    setFormData: any;
}

// Component definition
const ItemForm: FC<ItemFormProps> = ({
                                                           formData,
                                                           setFormData
                                                       }) => {
    const [isLoading, setIsLoading] = useState(true);

    const [companyIds, setCompanyIds] = useState([])
    const [shelfCategories, setShelfCategories] = useState([])
    const shelfIds = Object.keys(Shelves);
    const placeIds = Places

    const [lastErrorTimestamp, setLastErrorTimestamp] = useState<number | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
    const [validationError, setValidationError] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const { pending, startSubmit, finishSubmit } = useFormStatus();

    const handleChange = (e) => {
        console.log(e.target.name, e.target.value); // Log the change event details
        const { name, value } = e.target;
        let newValue = name === 'companyId' ? value : formatCommasToDots(value); // Ensure companyId doesn't get processed with formatCommasToDots
        setFormData({
            ...formData,
            [name]: newValue,
        });
    };

    const handleDivClick = (id) => {
        // console.log("Setting shelf type to:", id);
        setFormData(prevState => ({ ...prevState, shelfType: id }));
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const companiesResponse = await axios.get('/api/company');
                const categoriesResponse = await axios.get('/api/category');
                setCompanyIds(companiesResponse.data);
                setShelfCategories(categoriesResponse.data);

                // Set the formData.companyId to the first company ID
                if (companiesResponse.data.length) {
                    setFormData(prevData => ({ ...prevData, companyId: companiesResponse.data[0].id }));
                }

                // Set the formData.shelf-category to the first shelf-category
                if (categoriesResponse.data.length) {
                    setFormData(prevData => ({ ...prevData, shelfCategory: categoriesResponse.data[0].id }));
                }

            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                setIsLoading(false); // Set loading to false when done fetching
            }
        };
        fetchData();
    }, []);




    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        startSubmit();

        const result = await universalHandleSubmit(
            formData,
            ItemSchema,
            async (data) => {
                try {
                    // This is a placeholder for the actual server submit functionality
                    // e.g., an API call.
                    // throw new Error('ciul');
                    // console.log('posting...')
                    // console.log(data)

                    const shelfResult = await sortTool(
                        formData.shelfCategory,
                        formData.shelfType,
                        formData.itemType,
                        formData.typeAttributes
                    )
                    console.log(shelfResult)
                    let updatedFormData = { ...formData, shelfId: shelfResult.shelfId };

                    const object = await createItem(updatedFormData)
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
        isLoading ? (
            <div>Loading...</div> // Display a loading indicator or any other placeholder
        ) : (
        <form onSubmit={handleSubmit}>

            <TextInput
                id={'name'}
                note={fieldErrors.name || ''}
                value={formData.name}
                onChange={handleChange}
                description={'Każdy przedmiot musi mieć swój numer identyfikacjny, który wyróżnia go od całej reszty'}
                placeholder={'Numer identyfikacyjny'}
                title={'Numer identyfikacyjny przedmiotu'}
            />

            <InputDivider />

            <TextAreaInput
                note={''}
                title={'Opis przedmiotu'}
                value={formData.description}
                placeholder={'Opis'}
                description={'Opis jest dla Ciebie - cechy szczególne, ważne dodatkowe informacje'}
                onChange={handleChange}
                id={'description'}
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
                value={String(formData.companyId)}
                onChange={handleChange}
                description={'Producent przedmiotu jest wybierany z listy wszystkich firm dodanych do bazy.'}
                objectList={companyIds}
            />

            <InputDivider />

            <SelectInput
                id={'placeId'}
                title={'Miejsce docelowe przedmiotu'}
                note={fieldErrors.placeId || 'Domyślna opcja - nie można jej zmienić'}
                value={String(formData.placeId)}
                onChange={handleChange}
                objectList={placeIds}
                description={'Domyślnie przedmiot trafi do magazynu i zostanie przydzielony do odpowiedniej szuflady automatycznie'}
                enabledOptions={[1]}
            />

            <InputDivider />

            <div className="w-full flex justify-between">
                <div className="w-1/3">
                    <h2 className="text-lg mb-2">Typ szuflady</h2>
                    <p className="text-zinc-500 font-light text-sm">
                        Każdy przedmiot musi mieć przydzielony swój rozmiar szuflady, do którego będzie trafiać przy przeniesieniu do magazynu
                    </p>
                </div>
                <div className="w-1/3 text-xs">
                    <div className="flex flex-col">
                        <div className={'flex justify-between'}>
                            {shelfIds.map((id, index) => (
                                <div
                                    key={index}
                                    className={`w-2/5 rounded-xl flex-wrap aspect-square flex items-center justify-center p-2 border border-gray-300 my-1 cursor-pointer hover:bg-gray-100 ${formData.shelfType === id ? "bg-gray-200" : ""}`}
                                    onClick={() => handleDivClick(id)}
                                >
                                    <div className={'flex justify-center items-center flex-col'}>
                                        <Image className={'mb-3'} priority src={id === 'small' ? shelfSmall : shelfBig} alt={'shelf svg'} />
                                        {id}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <span className={'pt-3 pl-1'} ></span>
                        <div className="flex flex-col">
                            <select
                                className="w-full border-gray-300 p-3 rounded-lg text-sm focus:border-gray-500 focus:shadow-lg transition duration-150 ease-in-out"
                                name="shelfCategory"
                                value={formData.shelfCategory}
                                onChange={handleChange}
                            >
                                {shelfCategories && shelfCategories.map((category, index) => (
                                    <option key={index} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            <span className="pt-3 pl-1 mb-2 text-gray-500">Wybierz kategorię szuflady</span>
                        </div>
                    </div>
                </div>
            </div>

            <SubmitButton pending={pending} />

            {validationError && <ToastNotification key={lastErrorTimestamp} text={validationError} />}
            {showSuccessModal && <SuccessModal isOpen={true} text={'udalo sie'} bigText={'udalo sie'} objectData={formData} />}

        </form>
        )
    );
}

// Exporting the component
export default ItemForm;











