'use client'

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
import {useCompanies} from "@/components/hooks/useCompanies";
import {useShelfCategories} from "@/components/hooks/useShelfCategories";
import {FieldValues, useForm} from "react-hook-form";
import {ShelfCategory, ShelfCategorySchema} from "@/types/zod/Shelf";
import {zodResolver} from "@hookform/resolvers/zod";
import {registerAll} from "sucrase/dist/types/register";


// Component definition
const ItemForm = () => {
// TODO
    // const {companies, loading, error} = useCompanies()
    // const {shelfCategories, loading, error} = useShelfCategories()

    // const handleDivClick = (id) => {
    //     // console.log("Setting shelf type to:", id);
    //     setFormData(prevState => ({ ...prevState, shelfType: id }));
    // };

    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState({});

    const {
        control,
        register,
        handleSubmit,
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
        isLoading ? (
            <div>Loading...</div> // Display a loading indicator or any other placeholder
        ) : (
            <form
                onSubmit={handleSubmit(onSubmit)}
            >

            <TextInput
                {...register('name')}
                note={errors.name && `${errors.name.message}` || ''}
                description={'Każdy przedmiot musi mieć swój numer identyfikacjny, który wyróżnia go od całej reszty'}
                placeholder={'Numer identyfikacyjny'}
                title={'Numer identyfikacyjny przedmiotu'}
            />

            <InputDivider />

            <TextAreaInput
                {...register('description')}
                note={errors.description && `${errors.description.message}` || ''}
                title={'Opis przedmiotu'}
                placeholder={'Opis'}
                description={'Opis jest dla Ciebie - cechy szczególne, ważne dodatkowe informacje'}
            />

            <InputDivider />

            {/*<ItemTypeAttributesInput*/}
            {/*    description={'Typ przedmiotu - dodawany w dodaj -> dodaj typ przedmiotów. Sposób tworzenia typów jest pozostawiony użytkownikowi.'}*/}
            {/*    note={fieldErrors.itemType || 'Wybierz typ z listy, UWAGA! wpisywać wartości bez spacji i jednostek, aby algorytm odpowiednio segregował przedmoty'}*/}
            {/*    title={'Typ przedmiotu'}*/}
            {/*    id={'itemType'}*/}
            {/*    formData={formData}*/}
            {/*    setFormData={setFormData}*/}
            {/*/>*/}

            <InputDivider />

            <SelectInput
                control={control}
                title={'Producent'}
                note={errors.companyId && `${errors.companyId.message}` || ''}
                description={'Producent przedmiotu jest wybierany z listy wszystkich firm dodanych do bazy.'}
                objectList={companyIds}
            />

            <InputDivider />

            <SelectInput
                control={control}
                title={'Miejsce docelowe przedmiotu'}
                note={errors.placeId && `${errors.placeId.message}` || 'Domyślna opcja - nie można jej zmienić'}
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

            <SubmitButton pending={isSubmitting} />

            {showErrorModal && <ToastNotification key={Date.now()} text={errorMessage} />}
            {showSuccessModal && <SuccessModal isOpen={true} text={'Success!'} bigText={'Success!'} objectData={formData} />}

        </form>
        )
    );
}

// Exporting the component
export default ItemForm;











