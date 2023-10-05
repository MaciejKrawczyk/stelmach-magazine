'use client'

import React, {useState} from 'react';
import TextInput from "@/components/form/TextInput";
import InputDivider from "@/components/form/InputDivider";
import TextAreaInput from "@/components/form/TextAreaInput";
import SubmitButton from "@/components/form/SubmitButton";
import ToastNotification from "@/components/form/notification/ToastNotification";
import SuccessModal from "@/components/form/modal/SuccessModal";
import SelectInput from "@/components/form/SelectInput";
import {Places} from "@/objects/Places";
import Image from "next/image";
import shelfSmall from "@/public/shelfSmall.svg";
import shelfBig from "@/public/shelfBig.svg";
import {useCompanies} from "@/components/hooks/useCompanies";
import {useShelfCategories} from "@/components/hooks/useShelfCategories";
import { FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Item, ItemSchema} from "@/types/zod/Item";
import ItemTypeAttributesInput from "@/components/form/ItemTypeAttributesInput";
import {sortTool} from "@/utils/sortToolShelf";
import axios from "axios";
import FormEnding from "@/components/form/FormEnding";

const ItemForm = () => {

    const { companies, loading: companiesLoading, error: companiesError} = useCompanies()
    const { shelfCategories, loading:shelfCategoriesLoading, error: shelfCategoriesError} = useShelfCategories()
    const places = Places

    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState({});

    const {
        ...methods
    } = useForm({
        resolver: zodResolver(ItemSchema)
    })

    const onSubmit = async (data: Item) => {
        try {
            setShowErrorModal(false)
            setErrorMessage('')

            console.log(data)

            const shelfResult = await sortTool(
                data.shelfCategoryId,
                data.shelfSize,
                data.itemTypeId,
                data.attributes
            )

            data.shelfId = shelfResult.shelfId

            console.log(data)
            const object = await axios.post('/api/item', data)

            object.data.shelfName = object.data.shelf.name

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
            methods.reset();
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
        console.log(formData);
    };


    return (
        companiesLoading && shelfCategoriesLoading ? (
            <div>Loading...</div>
        ) : (
            <FormProvider {...methods}>
            <form
                onSubmit={methods.handleSubmit(onSubmit)}
            >

            <TextInput
                {...methods.register('name')}
                note={methods.formState.errors.name && `${methods.formState.errors.name.message}` || ''}
                description={'Każdy przedmiot musi mieć swój numer identyfikacjny, który wyróżnia go od całej reszty'}
                placeholder={'Numer identyfikacyjny'}
                title={'Numer identyfikacyjny przedmiotu'}
            />

            <InputDivider />

            <TextAreaInput
                {...methods.register('description')}
                note={methods.formState.errors.description && `${methods.formState.errors.description.message}` || ''}
                title={'Opis przedmiotu'}
                placeholder={'Opis'}
                description={'Opis jest dla Ciebie - cechy szczególne, ważne dodatkowe informacje'}
            />

            <InputDivider />

            <ItemTypeAttributesInput
                description={'Typ przedmiotu - dodawany w dodaj -> dodaj typ przedmiotów. Sposób tworzenia typów jest pozostawiony użytkownikowi.'}
                note={methods.formState.errors.itemTypeId && `${methods.formState.errors.itemTypeId.message}` || 'Wybierz typ z listy, UWAGA! wpisywać wartości bez spacji i jednostek, aby algorytm odpowiednio segregował przedmoty'}
                title={'Typ przedmiotu'}
            />

            <InputDivider />

            <SelectInput
                id={'companyId'}
                control={methods.control}
                title={'Producent'}
                note={methods.formState.errors.companyId && `${methods.formState.errors.companyId.message}` || ''}
                description={'Producent przedmiotu jest wybierany z listy wszystkich firm dodanych do bazy.'}
                objectList={companies}
            />

            <InputDivider />

            <SelectInput
                id={'placeId'}
                control={methods.control}
                title={'Miejsce docelowe przedmiotu'}
                note={methods.formState.errors.placeId && `${methods.formState.errors.placeId.message}` || 'Domyślna opcja - nie można jej zmienić'}
                objectList={places}
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
                            <label className="flex items-center">
                                <input
                                    {...methods.register('shelfSize')}
                                    type="radio"
                                    value={'small'}
                                    onChange={handleChange} // Add this line
                                />
                                <span className="ml-2">
                                    <div className={'flex justify-center items-center flex-col'}>
                                    <Image
                                        className={'mb-3'} priority src={ shelfSmall }
                                        alt={'shelf svg'}/>
                                        mała
                                    </div>
                                </span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    {...methods.register('shelfSize')}
                                    type="radio"
                                    value={'big'}
                                    onChange={handleChange} // Add this line
                                />
                                <span className="ml-2">
                                    <div className={'flex justify-center items-center flex-col'}>
                                    <Image
                                        className={'mb-3'} priority src={ shelfBig }
                                        alt={'shelf svg'}/>
                                        duża
                                    </div>
                                </span>
                            </label>
                        </div>

                        <span className={'pt-3 pl-1 text-gray-500'} >{methods.formState.errors.shelfSize && methods.formState.errors.shelfSize.message || ``}</span>

                        <div className="flex flex-col mt-5">
                            <select
                                {...methods.register('shelfCategoryId')}
                                className="w-full border-gray-300 p-3 rounded-lg text-sm focus:border-gray-500 focus:shadow-lg transition duration-150 ease-in-out"
                            >
                                <option value="">Wybierz kategorię szuflad</option>
                                {shelfCategories && shelfCategories.map((category, index) => (
                                    <option key={index} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            <span className="pt-3 pl-1 mb-2 text-gray-500">{methods.formState.errors.shelfCategoryId && methods.formState.errors.shelfCategoryId.message || `wybierz kategorię szuflad`}</span>
                        </div>


                    </div>
                </div>
            </div>

            <FormEnding />

            <SubmitButton pending={methods.formState.isSubmitting} />

            {showErrorModal && <ToastNotification key={Date.now()} text={errorMessage} />}
            {showSuccessModal && <SuccessModal isOpen={true} text={'Success!'} bigText={'Success!'} objectData={formData} />}

        </form>
        </FormProvider>
        )
    );
}

// Exporting the component
export default ItemForm;











