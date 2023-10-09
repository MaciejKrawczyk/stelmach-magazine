'use client'

import {useParams} from "next/navigation";
import React, {useEffect, useState} from "react";
import {Places} from "@/src/objects/Places";
import axios from "axios";
import Image from "next/image";
import shelfSmall from "@/public/shelfSmall.svg";
import shelfBig from "@/public/shelfBig.svg";
import {Shelves} from "@/src/objects/Shelves";
import {sortTool} from "@/src/utils/sortToolShelf";
import SuccessModal from "@/src/components/form/modal/SuccessModal";
import config from "@/config.json";
import ToastNotification from "@/src/components/form/notification/ToastNotification";
import SubmitButton from "@/src/components/submitButton";
import {sortToolExisting} from "@/src/utils/sortToolExisting";
import {PlaceNameById} from "@/src/utils/PlaceNameById";


const Page = () => {

    const params = useParams()
    const id = params.id

    const [item, setItem] = useState(null)
    // submit button
    const [isClicked, setIsClicked] = useState(false);
    // success modal
    const [isOpen, setIsOpen] = useState(false);
    const [object, setObject] = useState([]);

    const [isError, setIsError] = useState(false)
    const [toastText, setToastText] = useState('')

    const [shelfCategories, setShelfCategories] = useState([])
    const shelfIds = Object.keys(Shelves);

    const [from, setFrom] = useState('')

    const [formData, setFormData] = useState({
        orderCategoryId: null,
        name: "",
        placeId: "1",
        shelfCategory: 1,
        shelfId: "",
        isOrder: false,
        isDeleted: false,
        typeAttributes: undefined,
        shelfSize: undefined,
        // itemSentCategoryId: null
    });


    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesResponse = await axios.get('/api/shelf-category');
                const itemResponse = await axios.get(`/api/item/${id}`);
                setShelfCategories(categoriesResponse.data);
                setItem(itemResponse.data)
                // Update formData with the fetched item's attributeValue
                setFormData(prevState => ({
                    ...prevState,
                    typeAttributes: itemResponse.data.attributeValue,
                    itemType: itemResponse.data.itemType.id
                }));

            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchData();
    }, [id]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleDivClick = (id) => {
        // console.log("Setting shelf type to:", id);
        setFormData(prevState => ({ ...prevState, shelfSize: id }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsError(false)

        // Check if any property value in formData is an empty string
        const isAnyFieldEmpty = Object.values(formData).some(value => value === "");

        try {

            console.log(formData)

            const shelfResult = await sortToolExisting(
                formData.shelfSize,
                formData.shelfCategory,
                formData.itemType,
                formData.typeAttributes
            )

            setIsClicked(true);
            setIsOpen(false);

            // Update formData with shelfId before sending it
            let updatedFormData = {
                ...formData,
                shelfId: shelfResult.shelfId,
                from: `zamówienia "${item.orderCategory.name}"`,
                to: PlaceNameById(1),
            };

            const payload = updatedFormData;

            try {
                console.log(payload)

                const data = await axios.put(`/api/item/${id}`, payload)
                console.log(data)



                const objectToDisplay = {
                    shelfName: data.data.object.shelf.name,
                    shelfId: data.data.object.shelf.id,
                    shelfSize: data.data.object.shelf.size
                }

                console.log(data)
                setObject(objectToDisplay);
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
        } catch (e) {
            setToastText('Szuflada o wybranych parametrach nie znajduje się w kategorii')
            setIsError(true)
            setIsClicked(false);
        }
    };

    return <div className={'flex justify-center'}>

        <SuccessModal
            isOpen={isOpen}
            text={"Zamówienie zostało zrelizowane i przedmiot został przeniesiony do magazynu"}
            objectData={object}
            bigText={"zamówienie zrealizowane"}
        />

        <ToastNotification shouldAppear={isError} text={toastText} />

        <main className={'w-9/12 h-auto mb-28'}>

            <h1 className={'font-semibold text-3xl my-10 mx-auto '}>Przedmiot z zamówienia do magazynu nr {id}</h1>


            <form onSubmit={handleSubmit}>

                <div className={'w-full flex justify-between'}>
                    <div className={'w-2/5'}>
                        <h2 className={'text-lg mb-2'}>Numer identyfikacyjny przedmiotu</h2>
                        <p className={'text-zinc-500 font-light text-sm'}>Każdy przedmiot musi mieć swój numer identyfikacjny, który wyróżnia go od całej reszty</p>
                    </div>
                    <div className={'w-1/3 text-xs text-red-600'}>
                        <div className={'flex flex-col'}>
                            <input className="border-2 w-full border-gray-300 rounded-lg p-3 text-sm focus:border-gray-500 focus:shadow-lg transition duration-150 ease-in-out" placeholder={'numer identyfikacyjny'} type="text" name="name" value={formData.name} onChange={handleChange} />
                            <span className={'pt-3 pl-1'} >Numer nie podlego edycji po dodaniu przedmiotu</span>
                        </div>
                    </div>
                </div>
                <hr className={'my-7'}/>

                <div className="w-full flex justify-between">
                    <div className="w-1/3">
                        <h2 className="text-lg mb-2">Miejsce docelowe przedmiotu</h2>
                        <p className="text-zinc-500 font-light text-sm">
                            Domyślnie przedmiot trafi do magazynu, w którym zostanie przedzielona odpowiednia szuflada
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
                                    <option key={index} value={place.id} disabled={place.id !== 1}>
                                        {place.name}
                                    </option>
                                ))}
                            </select>

                            <span className="pt-3 pl-1 mb-2 text-gray-500">Domyślna opcja - nie można jej zmienić</span>
                        </div>
                    </div>
                </div>

                <hr className={'my-7'}/>

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
                                        className={`w-2/5 rounded-xl flex-wrap aspect-square flex items-center justify-center p-2 border border-gray-300 my-1 cursor-pointer hover:bg-gray-100 ${formData.shelfSize === id ? "bg-gray-200" : ""}`}
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
                                    {shelfCategories.map((category, index) => (
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

                <SubmitButton className={'mt-10'} isClicked={isClicked} />

            </form>


        </main>

    </div>
}

export default Page