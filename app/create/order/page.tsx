'use client'

import React, {useEffect, useState} from "react";
import {Shelves} from "@/objects/Shelves";
import {Places} from "@/objects/Places";
import axios from "axios";
import SubmitButton from "@/components/submitButton";
import SuccessModal from "@/components/form/modal/SuccessModal";
import config from "@/config.json";
import loadingSVG from "@/public/Dual Ring-1.5s-191px.svg";
import Image from "next/image";
import ToastNotification from "@/components/form/notification/ToastNotification";
import {generateRandomUUID} from "@/utils/generateRandomUUID";
import {Container} from "@/components/Container";
import NumberInput from "@/components/form/NumberInput";

const App = () => {

    const [formData, setFormData] = useState({
        orderCategoryId: "",
        isOrder: true,
        quantity: 1,
        name: `ORDER`,
        description: "",
        itemType: "",
        companyId: "",
        placeId: "18",  // Initialize placeId with the value "1"
        shelfType: 'small',
        shelfCategory: 1,
        shelfId: -1,
        typeAttributes: {}
    });

    const [typeAttributes, setTypeAttributes] = useState([]);

    const [itemTypes, setItemTypes] = useState([]);
    const [companyIds, setCompanyIds] = useState([]);
    const placeIds = Places
    const shelfIds = Object.keys(Shelves);
    const [orderCategories, setOrderCategories] = useState([])

    const [isLoadingTypes, setIsLoadingTypes] = useState(false)

    // submit button
    const [isClicked, setIsClicked] = useState(false);
    // success modal
    const [isOpen, setIsOpen] = useState(false);
    const [object, setObject] = useState([]);

    const [isError, setIsError] = useState(false)
    const [toastText, setToastText] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const itemTypesResponse = await axios.get('/api/itemtype');
                const companiesResponse = await axios.get('/api/company');
                const orderCategoriesResponse = await axios.get('/api/orderCategory')
                setItemTypes(itemTypesResponse.data);
                setCompanyIds(companiesResponse.data);
                setOrderCategories(orderCategoriesResponse.data)
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchData();
    }, []);

    // New useEffect for fetching type attributes when itemType changes
    useEffect(() => {
        const fetchTypeAttributes = async () => {
            setIsLoadingTypes(true)
            try {
                if (formData.itemType) {  // Only fetch if itemType exists
                    const response = await axios.get('/api/typeattribute', {
                        params: {
                            itemtypeId: formData.itemType
                        }
                    });
                    setTypeAttributes(response.data);
                }
            } catch (error) {
                console.error("Error fetching type attributes", error);
            }
            setIsLoadingTypes(false)
        };
        fetchTypeAttributes();
    }, [formData.itemType]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        const newValue = value.replace(/,/g, '.');

        setFormData({
            ...formData,
            [name]: newValue,
        });
    };


    const handleAttributesChange = (e) => {
        const { name, value } = e.target;

        const newValue = value.replace(/,/g, '.');

        // Update only the specific attribute value that was changed
        setFormData(prevState => ({
            ...prevState,
            typeAttributes: {
                ...prevState.typeAttributes,
                [name]: newValue
            }
        }));
    };



    const handleDivClick = (id) => {
        setFormData(prevState => ({ ...prevState, shelfType: id }));
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsError(false)

        // Check if any property value in formData is an empty string
        const isAnyFieldEmpty = Object.values(formData).some(value => value === "");

        // Check if any type attribute in formData.typeAttributes is an empty string
        const areTypeAttributesEmpty = typeAttributes.some(attribute => {
            return formData.typeAttributes[attribute.id] === undefined || formData.typeAttributes[attribute.id] === "";
        });

        console.log(formData)

        if (isAnyFieldEmpty) {
            alert("Wszystkie pola muszą być wypełnione.");
            return;
        }

        if (areTypeAttributesEmpty) {
            alert("Wszystkie szczegółowe dane typu predmiotu nie mogą być puste.");
            return;
        }

        setIsClicked(true);
        setIsOpen(false);

        let payload = formData

        try {
            for (let i=0;i<formData.quantity;i++) {
                const randomUUID = generateRandomUUID()
                payload.name = `ORDER | ${randomUUID}`
                const data = await axios.post('/api/item', payload)
                setObject(data.data);
            }
                console.log("Form data submitted", formData);
                setIsOpen(true);
                setIsClicked(false);
        } catch (e) {
            console.error(e)
            setIsError(true)
            setIsClicked(false);
            if (e.response.status === 409) {
                setToastText('Przedmiot z tym numerem istnieje juz w bazie')
            } else {
                setToastText('Wystąpił błąd przy dodawaniu przedmiotu do bazy')
            }

        }
    };

    return (
        <Container>

            <SuccessModal
                isOpen={isOpen}
                text={config.ui.successModal.messages.item.smallText}
                objectData={object}
                bigText={config.ui.successModal.messages.item.bigText}
            />

            <ToastNotification shouldAppear={isError} text={toastText} />



                <h1 className={'font-semibold text-3xl my-10 mx-auto '}>Dodawanie przedmiotów</h1>

                <form onSubmit={handleSubmit}>

                    <div className="w-full flex justify-between">
                        <div className="w-1/3">
                            <h2 className="text-lg mb-2">Zamówienie</h2>
                            <p className="text-zinc-500 font-light text-sm">
                                Zamówienie, które jest tworzone w dodaj zamówienie. W tym wybranym zamówieniu będą się znajdować zamówione tutaj narzędzia
                            </p>
                        </div>
                        <div className="w-1/3 text-xs">
                            <div className="flex flex-col">
                                <div className="flex justify-center items-center">
                                    {/*<div className="mx-3 px-2 bg-amber-600 cursor-pointer text-white aspect-square flex justify-center items-center rounded-3xl">+</div>*/}

                                    <select
                                        className="w-full border-gray-300 p-3 rounded-lg text-sm focus:border-gray-500 focus:shadow-lg transition duration-150 ease-in-out"
                                        name="orderCategoryId"
                                        value={formData.orderCategoryId}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled>Wybierz zamówienie</option>
                                        {orderCategories.map((orderCategory, index) => (
                                            <option key={index} value={orderCategory.id}>
                                                {orderCategory.name}
                                            </option>
                                        ))}
                                    </select>

                                </div>
                                <span className="pt-3 pl-1 mb-2 text-gray-500">Wybierz zamówienie z listy</span>
                            </div>
                        </div>
                    </div>

                    <hr className={'my-7'}/>

                    <div className={'w-full flex justify-between'}>
                        <div className={'w-2/5'}>
                            <h2 className={'text-lg mb-2'}>Ilość</h2>
                            <p className={'text-zinc-500 font-light text-sm'}>Wpisz ilość przedmiotów tego samego typu, które zamawiasz.</p>
                        </div>
                        <div className={'w-1/3 text-xs text-red-600'}>
                            <div className={'flex flex-col'}>
                                <input
                                    className="border-2 w-full border-gray-300 rounded-lg p-3 text-sm focus:border-gray-500 focus:shadow-lg transition duration-150 ease-in-out"
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                />
                                <span className={'pt-3 pl-1'} >Wybierz ilość narzędzi tego typu, które zostaną dodane do zamówienia</span>
                            </div>
                        </div>
                    </div>

                    {/*<NumberInput*/}
                    {/*    id={'quantity'}*/}
                    {/*    value={formData.quantity} */}
                    {/*    description={'Wpisz ilość przedmiotów tego samego typu, które zamawiasz.'} */}
                    {/*    title={'Ilość'}*/}
                    {/*    note={'Wybierz ilość narzędzi tego typu, które zostaną dodane do zamówienia'} */}
                    {/*    setValue={}*/}
                    {/*/>*/}

                    <hr className={'my-7'}/>

                    <div className={'w-full flex justify-between'}>
                        <div className={'w-2/5'}>
                            <h2 className={'text-lg mb-2'}>Opis przedmiotu</h2>
                            <p className={'text-zinc-500 font-light text-sm'}>Opis jest dla Ciebie - cechy szczególne, ważne dodatkowe informacje</p>
                        </div>
                        <div className={'w-1/3 text-xs text-red-600'}>
                            <div className={'flex flex-col'}>
                                <textarea
                                    placeholder={'Opis'}
                                    className="border-2 w-full border-gray-300 rounded-lg p-3 text-sm focus:border-gray-500 focus:shadow-lg transition duration-150 ease-in-out"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                ></textarea>
                                <span className={'pt-3 pl-1'} ></span>
                            </div>
                        </div>
                    </div>
                    <hr className={'my-7'}/>

                    <div className="w-full flex justify-between">
                        <div className="w-1/3">
                            <h2 className="text-lg mb-2">Typ przedmiotu</h2>
                            <p className="text-zinc-500 font-light text-sm">
                                Typ przedmiotu - dodawany w dodaj -> dodaj typ przedmiotów.
                                Sposób tworzenia typów jest pozostawiony użytkownikowi.
                            </p>
                        </div>
                        <div className="w-1/3 text-xs">
                            <div className="flex flex-col">
                                <div className="flex justify-center items-center">
                                    {/*<div className="mx-3 px-2 bg-amber-600 cursor-pointer text-white aspect-square flex justify-center items-center rounded-3xl">+</div>*/}

                                    {isLoadingTypes ? <div className="flex justify-center items-center">
                                        <Image priority alt={'loading...'} src={loadingSVG} />
                                    </div> : <></>}

                                    <select
                                        className="w-full border-gray-300 p-3 rounded-lg text-sm focus:border-gray-500 focus:shadow-lg transition duration-150 ease-in-out"
                                        name="itemType"
                                        value={formData.itemType}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled>Wybierz typ przedmiotu</option>
                                        {itemTypes.map((type, index) => (
                                            <option key={index} value={type.id}>
                                                {type.name}
                                            </option>
                                        ))}
                                    </select>

                                </div>
                                <span className="pt-3 pl-1 mb-2 text-gray-500">Wybierz typ z listy, UWAGA! wpisywać wartości bez spacji i jednostek, aby algorytm odpowiednio segregował przedmoty</span>

                                {typeAttributes.map((attribute, index) => (
                                    <div key={index} className="relative my-4">
                                        <input
                                            id={`input_${index}`}
                                            className="border-2 w-full border-gray-300 rounded-lg p-3 text-sm focus:border-gray-500 focus:shadow-lg transition-all duration-150 ease-in-out appearance-none"
                                            type="text"
                                            name={attribute.id}
                                            onChange={handleAttributesChange}
                                            value={formData.typeAttributes[attribute.id] || ''}
                                        />
                                        <label htmlFor={`input_${index}`} className="absolute text-sm top-0 left-3 bg-white px-1 text-gray-500 transform origin-left scale-90 -translate-y-2 pointer-events-none transition-transform duration-300 ease-in-out">
                                            {attribute.name}
                                        </label>
                                    </div>
                                ))}

                            </div>
                        </div>
                    </div>

                    <hr className={'my-7'}/>

                    <div className="w-full flex justify-between">
                        <div className="w-1/3">
                            <h2 className="text-lg mb-2">Producent</h2>
                            <p className="text-zinc-500 font-light text-sm">
                                Producent przedmiotu jest wybierany z listy wszystkich firm dodanych do bazy.
                            </p>
                        </div>
                        <div className="w-1/3 text-xs">
                            <div className="flex flex-col">
                                <div className="flex justify-center items-center">
                                    {/*<div className="mx-3 px-2 bg-amber-600 cursor-pointer text-white aspect-square flex justify-center items-center rounded-3xl">+</div>*/}

                                    <select
                                        className="w-full border-gray-300 p-3 rounded-lg text-sm focus:border-gray-500 focus:shadow-lg transition duration-150 ease-in-out"
                                        name="companyId"
                                        value={formData.companyId}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled>Wybierz firmę</option>
                                        {companyIds.map((company, index) => (
                                            <option key={index} value={company.id}>
                                                {company.name}
                                            </option>
                                        ))}
                                    </select>

                                </div>
                                <span className="pt-3 pl-1 mb-2 text-gray-500">Wybierz producenta z listy</span>
                            </div>
                        </div>
                    </div>

                    <hr className={'my-7'}/>

                    <div className="w-full flex justify-between">
                        <div className="w-1/3">
                            <h2 className="text-lg mb-2">Miejsce docelowe przedmiotu</h2>
                            <p className="text-zinc-500 font-light text-sm">
                                Jest to zamówiony przedmiot, trafi on do listy zamówionych
                            </p>
                        </div>
                        <div className="w-1/3 text-xs">
                            <div className="flex flex-col">

                                <select
                                    className="w-full border-gray-300 p-3 rounded-lg text-sm focus:border-gray-500 focus:shadow-lg transition duration-150 ease-in-out"
                                    name="placeId"
                                    value={formData.placeId}
                                    onChange={handleChange}
                                >
                                    <option value="" disabled>Select a place ID</option>
                                    {Places.map((place, index) => (
                                        <option key={index} value={place.id} disabled={place.id !== 18}>
                                            {place.name}
                                        </option>
                                    ))}
                                </select>

                                <span className="pt-3 pl-1 mb-2 text-gray-500">Domyślna opcja - nie można jej zmienić</span>
                            </div>
                        </div>
                    </div>

                    <SubmitButton className={'mt-10'} isClicked={isClicked} />

                </form>

        </Container>
    );
};

export default App;
