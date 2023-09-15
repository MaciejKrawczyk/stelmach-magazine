'use client'

import React, {useEffect, useState} from "react";
import axios from "axios";
import Image from "next/image";
import loadingSVG from "@/public/Dual Ring-1.5s-191px.svg";
import {Places} from "@/objects/Places";
import pin from "@/public/place-marker-svgrepo-com 1.svg";
import settings from "@/public/Setting_alt_line.svg";
import Link from "next/link";
import ItemTile from "@/components/ItemTile";

const page = () => {

    const [items, setItems] = useState([])
    const [orderCategories, setOrderCategories] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedPlace, setExpandedPlace] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/item');
                const orderCategoriesResponse = await axios.get('/api/orderCategory')
                if (isMounted) {
                    setItems(response.data);
                    setOrderCategories(orderCategoriesResponse.data)
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

    // const itemCount = orderCategories.reduce((acc, item) => {
    //     acc[item.id] = (acc[item.placeId] || 0) + 1;
    //     return acc;
    // }, {});


    return <div className='flex justify-center'>
        <main className='w-10/12 h-auto mb-28'>
            <h1 className='font-semibold text-3xl my-10 mx-auto'>Zamówienia</h1>

            {orderCategories.map((place, index) => (
                <div key={index}>
                    <div className="flex items-center my-5 p-2 cursor-pointer rounded-xl transition-colors duration-200 hover:bg-gray-200" onClick={() => setExpandedPlace(prevPlace => prevPlace === place.id ? null : place.id)}>
                        <div className="flex items-center mr-2">
                            <Image className="" priority src={pin} alt="pin" />
                            <div className="mx-4">
                                <span className='text-gray-900'>{place.name}</span>
                                <span className='mx-1 text-gray-400 text-sm'></span>
                            </div>
                        </div>
                        <hr className="flex-grow border-t-2" />
                        <Image className="ml-4" priority src={settings} alt="settings" />
                    </div>
                    {expandedPlace === place.id && (
                        <section className='flex gap-5 flex-wrap'>
                            {items.filter(item => item.orderCategoryId === place.id).map((item, idx) => {
                                const orderCategoryColor = item.orderCategory !== null ? item.orderCategory.color : null
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
                        </section>
                    )}
                </div>
            ))}


        </main>
    </div>
}

export default page