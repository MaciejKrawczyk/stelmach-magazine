'use client'

import Image from "next/image";
import info from "@/public/Info_alt_light.svg";
import scan from "@/public/Scan_alt_2.svg";
import user from "@/public/Company.svg";
import dateIcon from "@/public/date.svg";
import React, {useEffect, useRef, useState} from "react";
import {formatDate} from "@/src/utils/formatDate";
import {useRouter} from "next/navigation";
import arrow from '@/public/arrow-up-from-bracket-svgrepo-com.svg'
import MoveItemForm from "@/src/components/MoveItemForm";


const ItemTile = ({placeId, itemType, name, company, date, shelfSize, shelfId, itemId, orderCategoryColor}) => {

    const router = useRouter()

    const [isMoveFormModal, setIsMoveFormModal] = useState(false)

    const [isModalVisible, setModalVisible] = useState(false);
    const modalRef = useRef(null);
    const toggleRef = useRef(null);

    useEffect(() => {
        function handleOutsideClick(event) {
            if (modalRef.current && !modalRef.current.contains(event.target) && !toggleRef.current.contains(event.target)) {
                setModalVisible(false);
            }
        }
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const handleRedirect = () => {
        router.push(`/${itemId}`)
    }


    return (<div
        className={`p-5 w-64 h-80 bg-gray-100 flex flex-col border-gray-200 rounded-xl shadow-item `}
    >

        {isMoveFormModal && <MoveItemForm id={itemId} />}

        <div
            className={'flex justify-between w-full'}>

            <div className={'bg-blue-500 py-1 px-5 text-white rounded-full'}>
                {itemType}
            </div>
            { orderCategoryColor !== null ? (<div style={{backgroundColor: orderCategoryColor}} className={'py-1 px-5 text-white rounded-full'}></div>) : null }
            <Image src={info} alt={'info'}></Image>
        </div>
        <hr className={'my-2'}/>
        <div className={'flex flex-col gap-3 justify-start w-full'}>
            <div
                onClick={handleRedirect}
                className={'flex cursor-pointer transition-colors duration-200 hover:bg-gray-200'}
            >
                <Image className={'mr-3'} src={scan} alt={'info'}></Image>
                <span className={'text-gray-400'}>{name.length > 19 ? name.substring(0, 19) + '...' : name}</span>
            </div>
            <hr className={'my-1'}/>
            <div className={'flex'}>
                <Image className={'mr-3'} src={user} alt={'info'}></Image>
                <span className={'text-gray-400'}>{company}</span>
            </div>
            <hr className={'my-1'}/>
            <div className={'flex'}>
                <Image className={'mr-3'}  src={dateIcon} alt={'info'}></Image>
                <span className={'text-gray-400'}>{formatDate(date)}</span>
            </div>
            <hr className={'my-1'}/>
            <div className={'flex'}>
                <div
                    onClick={() => setIsMoveFormModal(true)}
                    className={'cursor-pointer flex justify-center items-center w-10 h-10 bg-white border-amber-400 border-2 text-amber-400 rounded-full'}>
                    <Image priority src={arrow} alt={'item has returned'} />
                </div>
            </div>
        </div>
    </div>)
}

export default ItemTile