'use client'

import Image from "next/image";
import info from "@/public/Info_alt_light.svg";
import scan from "@/public/Scan_alt_2.svg";
import user from "@/public/Company.svg";
import dateIcon from "@/public/date.svg";
import boxClosed from "@/public/Box_alt.svg";
import boxOpen from "@/public/Box_open.svg";
import Link from "next/link";
import meatballs from "@/public/Meatballs_menu.svg";
import edit from "@/public/Edit_light.svg";
import change from "@/public/Horizontal_down_right_main_light.svg";
import trash from "@/public/Trash_light.svg";
import React, {useEffect, useRef, useState} from "react";
import ItemTileModal from "@/src/components/ItemTileModal";
import arrow from '@/public/arrow.svg'
import {formatDate} from "@/src/utils/formatDate";
import {useRouter} from "next/navigation";


const itemTile = ({placeId, itemType, name, company, date, shelfSize, shelfId, itemId, orderCategoryColor}) => {

    const router = useRouter()

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
        className={`p-5 w-64 'h-auto' bg-gray-100 flex flex-col border-gray-200 rounded-xl shadow-item `}
    >
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
                <Image className={'mr-3'}  src={user} alt={'info'}></Image>
                <span className={'text-gray-400'}>{company}</span>
            </div>
            <hr className={'my-1'}/>
            <div className={'flex'}>
                <Image className={'mr-3'}  src={dateIcon} alt={'info'}></Image>
                <span className={'text-gray-400'}>{formatDate(date)}</span>
            </div>
            <hr className={'my-1'}/>
            {placeId === 1 && shelfSize && (
                <div className={'flex'}>
                    <Image className={'mr-3'} src={boxClosed} alt={'info'}></Image>
                    <span className={'text-gray-400'}>{shelfSize}</span>
                </div>
            )}
            {shelfId && (
                <div className={'flex'}>
                    <Image className={'mr-3'} src={boxOpen} alt={'info'}></Image>
                    <span className={'text-gray-400'}>{shelfId}</span>
                </div>
            )}
        </div>
        <div className={'flex justify-between my-4'}>
            <div
                onClick={() => setModalVisible(!isModalVisible)}
                className={'relative p-2 aspect-square bg-gray-300 rounded-full transform transition-transform duration-300 hover:scale-110'}
            >
                <div className={'cursor-pointer'}>
                    <Image src={meatballs} alt={'info'}></Image>
                </div>

                {isModalVisible && (
                    <ItemTileModal
                        isVisible={isModalVisible}
                        itemId={itemId}
                        orderCategoryColor={orderCategoryColor}
                    />
                )}
            </div>
            <Link
                className={'p-2 aspect-square bg-gray-300 rounded-full transform transition-transform duration-300 hover:scale-110'}
                href={`/edit/${itemId}`}
            >
                <Image src={edit} alt={'info'}></Image>
            </Link>

            { orderCategoryColor === null ? (
                <Link
                    className={'p-2 aspect-square bg-gray-300 rounded-full transform transition-transform duration-300 hover:scale-110'}
                    href={`/move/${itemId}`}>
                    <Image src={change} alt={'info'}></Image>
                </Link>
            ) :
            <Link
                className={'p-2 aspect-square bg-gray-300 rounded-full transform transition-transform duration-300 hover:scale-110'}
                href={`/orderToMagazine/${itemId}`}>
                <Image src={arrow} alt={'do magazynu'}></Image>
            </Link> }

        </div>
    </div>)
}

export default itemTile