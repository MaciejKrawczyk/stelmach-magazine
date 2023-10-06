'use client'

import React, {useEffect, useState} from "react";
import axios from "axios";
import Image from "next/image";
import loadingSVG from "@/public/Dual Ring-1.5s-191px.svg";
import pin from "@/public/place-marker-svgrepo-com 1.svg";
import settings from "@/public/Setting_alt_line.svg";
import ItemTile from "@/components/ItemTile";
import arrow from '@/public/arrow_right.svg'
import SuccessModal from "@/components/form/modal/SuccessModal";
import '@/public/SuccessModal.css';
import ItemTileWithoutOptions from "@/components/ItemTileWithoutOptions";

const page = () => {

    const [items, setItems] = useState([]);
    const [itemSent, setItemSent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedPlace, setExpandedPlace] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);  // State for the modal
    const [modalData, setModalData] = useState(null); // State to store data for the modal

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                const [itemResponse, parcelResponse] = await Promise.all([
                    axios.get('/api/item'),
                    axios.get('/api/parcel')
                ]);

                if (isMounted) {
                    setItems(itemResponse.data);
                    setItemSent(parcelResponse.data);
                    setLoading(false);
                }
            } catch (e) {
                console.error('Failed to fetch data:', e);
                if (isMounted) {
                    setError(e);
                    setLoading(false);
                }
            }
        };
        fetchData();

        return () => {
            isMounted = false;
        };
    }, []);


    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Image priority alt={'loading...'} src={loadingSVG} />
            </div>
        );
    }

    if (error) return <div>Error loading data</div>;

    async function send() {
        // Filter items based on the expandedPlace id and extract their ids
        const selectedItemIds = items.filter(item => item.parcelId === expandedPlace).map(item => item.id);

        // Create the payload for the PUT request
        const payload = {
            itemIds: selectedItemIds,
            placeId: 2,
            parcelId: expandedPlace
        };

        try {
            const object = await axios.put(`/api/item/parcelSend`, payload);
            setModalData(object);
            setIsModalOpen(true);
        } catch(e) {
            console.error('Failed to send:', e);
        }

    }

    return (
    <div className='flex justify-center'>
        <main className='w-10/12 h-auto mb-28'>
            <h1 className='font-semibold text-3xl my-10 mx-auto'>Paczki do wysłania</h1>

            {itemSent.map((place, index) => {
                const associatedItems = items.filter(item => item.parcelId === place.id);
                const isAnyItemSent = associatedItems.some(item => item.parcel?.isSent);

                return (
                <div key={index}>
                    <div className="flex items-center my-5 p-2 cursor-pointer rounded-xl transition-colors duration-200 hover:bg-gray-200" onClick={() => setExpandedPlace(prevPlace => prevPlace === place.id ? null : place.id)}>
                        <div className="flex items-center mr-2">
                            <Image className="" priority src={pin} alt="pin" />
                            <div className="mx-4">
                                <span className='text-gray-900'>{place.name}&emsp;=>&emsp;{place.company.name}</span>
                                <span className='mx-1 text-gray-400 text-sm'></span>
                            </div>
                        </div>
                        <hr className="flex-grow border-t-2" />
                        <Image className="ml-4" priority src={settings} alt="settings" />
                    </div>
                    {expandedPlace === place.id && (
                        <section className='flex gap-5 flex-wrap'>
                            {
                                items.filter(item => item.parcelId === place.id).map((item, idx) => {
                                const orderCategoryColor = item.parcel ? item.parcel.color : null;

                                return (
                                    <ItemTileWithoutOptions
                                        shelfId={item.shelfId}
                                        shelfSize={""}
                                        key={idx}
                                        placeId={place.id}
                                        itemId={item.id}
                                        itemType={item.itemType.name}
                                        name={item.name}
                                        company={item.company.name}
                                        date={item.status[0].createdAt}
                                        orderCategoryColor={orderCategoryColor}
                                    />
                                )})}

                            {!isAnyItemSent ? (<div className='w-64 h-96 bg-gray-100 flex flex-col justify-center items-center border-gray-200 rounded-xl shadow-item'>
                                <div onClick={send} className="relative cursor-pointer mb-4 w-1/2 aspect-square rounded-full bg-amber-100 flex items-center justify-center transition duration-200 hover:bg-amber-200">
                                    <Image priority src={arrow} width={60} alt={'send'}/>
                                </div>
                                <div className='flex justify-center items-center flex-col'>
                                    <h3 className='text-xl font-bold mb-2'>Wyślij paczkę</h3>
                                    <p className='text-lg font-light text-gray-500 text-center'>Wszystkie przedmioty w paczce zostaną wysłane do firmy <strong>{place.company.name}</strong></p>
                                </div>
                            </div>) : (<div className='w-64 h-96 bg-gray-100 flex flex-col justify-center items-center border-gray-200 rounded-xl shadow-item'>
                                {/*<div className="relative cursor-pointer mb-4 w-1/2 aspect-square rounded-full bg-amber-100 flex items-center justify-center transition duration-200 hover:bg-amber-200">*/}
                                    {/*<Image priority src={arrow} width={60} alt={'send'}/>*/}
                                    <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                        <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                                        <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                                    </svg>
                                {/*</div>*/}
                                <div className='flex justify-center items-center flex-col'>
                                    <h3 className='text-xl font-bold mb-2'>Paczka wysłana</h3>
                                    <p className='text-lg font-light text-gray-500 text-center'>Wszystkie przedmioty w paczce zostały wysłane do firmy <strong>{place.company.name}</strong></p>
                                </div>
                            </div>)}
                        </section>
                    )}
                </div>
            )})}
        </main>

        {isModalOpen && (
            <SuccessModal
                isOpen={isModalOpen}
                text={'Success!'}
                bigText={'Success!'}
                objectData={modalData}
            />
        )}

    </div>
    )
}


export default page