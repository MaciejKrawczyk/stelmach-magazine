'use client';

import {useParams} from "next/navigation";
import React from "react";
import Image from "next/image";
import loadingSVG from "@/public/Dual Ring-1.5s-191px.svg";
import {formatDateToObject} from "@/src/utils/formatDate";
import {useItem} from "@/src/hooks/useItem";

const Page = () => {

    const params = useParams();
    const id = Number(params.id);

    const {item, loading, error} = useItem(id);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Image priority alt={'loading...'} src={loadingSVG} />
            </div>
        );
    }

    if (error) return <div>Error loading data</div>;

    if (!item) return null;

    return (
        <div className={'flex justify-center'}>
            <main className={'w-9/12 h-auto mb-28'}>
                <h1 className={'font-semibold text-3xl my-10 mx-auto '}>Przedmiot {item.name}</h1>
                <div className={'grid grid-cols-2 gap-10'}>
                    <div className={'w-full relative'}>
                        {/* Vertical line added here */}
                        <div className={'absolute left-0.5 top-0 h-full border-l-2 border-l-gray-500'}></div>
                        {item.status.map((status, index) => {
                            const dateObject = formatDateToObject(status.createdAt);
                            return (
                                <div key={index} className={'flex items-center relative'}>
                                    {/* Circle positioned above line using z-index */}
                                    <div className={'w-2 h-2 rounded-full bg-gray-900 z-10 relative'}></div>
                                    <div className={'flex items-center w-full my-4 ml-5'}>
                                        <div className={'flex items-center'}>
                                            <div className={''}>
                                                <div className={'text-xs text-gray-500'}>{dateObject.month}</div>
                                                <div className={'text-sm mr-3'}>{dateObject.day}</div>
                                            </div>
                                            <div className={'text-sm w-14'}>{dateObject.time}</div>
                                        </div>
                                        <div className={''}>
                                            <div className={'text-xl'}>{status.name}</div>
                                            <div className={'text-gray-700'}>{status.description}</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className={'bg-red-600 w-full h-96 rounded-xl text-white flex justify-center flex-col items-center text-center'}>
                        <div className={'my-2'}>
                            <p>Firma</p>
                            <p>{item.company.name}</p>
                        </div>
                        <div className={'my-2'}>
                            <p>Opis</p>
                            <p>{item.description}</p>
                        </div>
                        <div className={'my-2'}>
                            <p>Typ</p>
                            <p>{item.itemType.name}</p>
                        </div>
                        {item.attributeValue.map((attribute) => (
                            <div className={'my-2'} key={attribute.id}>
                                <p>{attribute.typeAttribute.name}</p>
                                <p>{attribute.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Page;
