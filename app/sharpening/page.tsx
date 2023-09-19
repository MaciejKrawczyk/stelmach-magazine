'use client'

import React, {useEffect, useState} from "react";
import axios from "axios";
import Image from "next/image";
import loadingSVG from "@/public/Dual Ring-1.5s-191px.svg";
import pin from "@/public/place-marker-svgrepo-com 1.svg";
import settings from "@/public/Setting_alt_line.svg";
import ItemTile from "@/components/ItemTile";
import Link from "next/link";
import arrow from '@/public/arrow_right.svg'

const page = () => {

    const [items, setItems] = useState([])
    const [itemSent, setItemSent] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedPlace, setExpandedPlace] = useState(null);

    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/item');
                const orderCategoriesResponse = await axios.get('/api/itemSent')
                if (isMounted) {
                    setItems(response.data);
                    setItemSent(orderCategoriesResponse.data)
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
        return () => { isMounted = false; };
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Image priority alt={'loading...'} src={loadingSVG} />
            </div>
        );
    }

    if (error) return <div>Error loading data</div>;

    function send() {
        // Filter items based on the expandedPlace id and store them in selectedItems
        const itemsFromExpandedPlace = items.filter(item => item.itemSentCategoryId === expandedPlace);
        setSelectedItems(itemsFromExpandedPlace);
        console.log(selectedItems)
    }

    return <div className='flex justify-center'>
        <main className='w-10/12 h-auto mb-28'>
            <h1 className='font-semibold text-3xl my-10 mx-auto'>Paczki do wysłania</h1>

            {itemSent.map((place, index) => (
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
                            {items.filter(item => item.itemSentCategoryId === place.id).map((item, idx) => {
                                const orderCategoryColor = item.itemSentCategory !== null ? item.itemSentCategory.color : null

                                return (
                                    <ItemTile
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

                            <div className='w-64 h-96 bg-gray-100 flex flex-col justify-center items-center border-gray-200 rounded-xl shadow-item'>
                                <div onClick={send} className="relative cursor-pointer mb-4 w-1/2 aspect-square rounded-full bg-amber-100 flex items-center justify-center transition duration-200 hover:bg-amber-200">
                                    <Image priority src={arrow} width={60} alt={'send'}/>
                                </div>
                                <div className='flex justify-center items-center flex-col'>
                                    <h3 className='text-xl font-bold mb-2'>Wyślij paczkę</h3>
                                    <p className='text-lg font-light text-gray-500 text-center'>Wszystkie przedmioty w paczce zostaną wysłane do firmy <strong>{place.company.name}</strong></p>
                                </div>
                            </div>

                        </section>
                    )}
                </div>
            ))}
        </main>
    </div>
}

export default page