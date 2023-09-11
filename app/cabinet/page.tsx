'use client'

import React, {useEffect, useState} from "react";
import axios from "axios";
import Image from "next/image";
import loadingSVG from "@/public/Dual Ring-1.5s-191px.svg";
import tool from '@/public/small-tool.svg'


const page = () => {

    const [categories, setCategories] = useState([])
    const [items, setItems] = useState([])
    const [shelves, setShelves] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            const url = '/api/shelf';
            try {
                const response = await axios.get(url);
                const responseItem = await axios.get('/api/item')
                const responseCategory = await axios.get('/api/category')
                if (isMounted) {
                    setShelves(response.data);
                    setItems(responseItem.data)
                    setCategories(responseCategory.data)
                    console.log(responseItem.data)
                    console.log(response.data)
                    console.log(responseCategory.data)
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
        return <div className="flex justify-center items-center min-h-screen">
            <Image priority alt={'loading...'} src={loadingSVG}/>
        </div>
    }


    if (error) {
        return <div>Error loading data</div>;
    }


    return (
        <>
            <div className={'flex justify-center'}>
                <main className={'w-10/12 h-auto mb-28'}>
                    <h1 className={'font-semibold text-3xl my-10 mx-auto '}>Przegląd szafy</h1>
                    <div className={'w-8/12 h-auto grid grid-cols-3'}>
                        <div className={'gap-3 border-gray-600 w-auto grid grid-cols-5 grid-rows-16'}>
                            {
                                shelves
                                    .filter(shelf => shelf.name >= 1 && shelf.name <= 80 && shelf.size === "small")
                                    .map(shelf => (
                                        <div
                                            className={'flex items-center justify-center'}
                                            key={shelf.id}
                                            style={{backgroundColor: shelf.category.color}}
                                        >
                                            {/*{shelf.name}*/}
                                            {shelf.item.length > 0 && (
                                                <Image src={tool} priority alt={'tool'}/>
                                            )}
                                        </div>
                                    ))
                            }
                        </div>
                        <div className={'gap-3 border-gray-600 w-auto h-auto grid grid-cols-6 grid-rows-12'}>
                            {
                                shelves
                                    .filter(shelf => shelf.name >= 1 && shelf.name <= 72 && shelf.size === "big")
                                    .map(shelf => (
                                        <div
                                            className={'flex items-center justify-center'}
                                            key={shelf.id}
                                            style={{backgroundColor: shelf.category.color}}
                                        >
                                            {/*{shelf.name}*/}
                                            {shelf.item.length > 0 && (
                                                <Image src={tool} priority alt={'tool'}/>
                                            )}
                                        </div>
                                    ))
                            }
                        </div>
                        <div className={'gap-3 border-gray-600 w-auto grid grid-cols-5 grid-rows-16'}>
                            {
                                shelves
                                    .filter(shelf => shelf.name >= 81 && shelf.name <= 160 && shelf.size === "small")
                                    .map(shelf => (
                                        <div
                                            className={'flex items-center justify-center'}
                                            key={shelf.id}
                                            style={{backgroundColor: shelf.category.color}}
                                        >
                                            {/*{shelf.name}*/}
                                            {shelf.item.length > 0 && (
                                                <Image src={tool} priority alt={'tool'}/>
                                            )}
                                        </div>
                                    ))
                            }
                        </div>
                    </div>
                    <hr className={'my-5'}/>
                    <div>
                        {categories.map((category) => (
                            <div key={category.id}>
                                {category.name}
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </>
    )
}
export default page