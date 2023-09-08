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
import ItemTileModal from "@/components/ItemTileModal";


const itemTile = ({itemType, name, company, date, shelfType, shelfId, itemId}) => {

    const [isModalVisible, setModalVisible] = useState(false);
    const modalRef = useRef(null);
    const toggleRef = useRef(null);

    function formatDate(dateStr) {
        let date = new Date(dateStr);
        //   let testDateStr = "2023-09-06T11:55:53.333Z";
        const month = String(date.getMonth() + 1)
        const months = {
            1: 'STY',
            2: 'LUT',
            3: 'MAR',
            4: 'KWI',
            5: 'MAJ',
            6: 'CZE',
            7: 'LIP',
            8: 'SIE',
            9: 'WRZ',
            10: 'PAŹ',
            11: 'LIS',
            12: 'GRU'
        }
        return `${String(date.getDate()).padStart(2, '0')} ${months[month]} ${date.getFullYear()} | ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    }

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

    return (<div className={'p-5 w-64 h-96 bg-gray-100 flex flex-col border-gray-200 rounded-xl shadow-item'}>
        <div className={'flex justify-between w-full'}>
            <div className={'bg-blue-500 py-1 px-5 text-white rounded-full'}>
                {itemType}
            </div>
            <Image src={info} alt={'info'}></Image>
        </div>
        <hr className={'my-2'}/>
        <div className={'flex flex-col gap-3 justify-start w-full'}>
            <div className={'flex'}>
                <Image className={'mr-3'} src={scan} alt={'info'}></Image>
                <span className={'text-gray-400'}>{name}</span>
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
            <div className={'flex'}>
                <Image className={'mr-3'}  src={boxClosed} alt={'info'}></Image>
                <span className={'text-gray-400'}>{shelfType}</span>
            </div>
            <div className={'flex'}>
                <Image className={'mr-3'}  src={boxOpen} alt={'info'}></Image>
                <span className={'text-gray-400'}>{shelfId}</span>
            </div>
        </div>
        <div className={'flex justify-between my-4'}>
            <div
                onClick={() => setModalVisible(!isModalVisible)}
                onMouseLeave={() => setModalVisible(false)}
                className={'relative p-2 aspect-square bg-gray-300 rounded-full transform transition-transform duration-300 hover:scale-110'}
            >
                <div className={'cursor-pointer'}>
                    <Image src={meatballs} alt={'info'}></Image>
                </div>

                {isModalVisible && (
                    <ItemTileModal
                        onMouseLeave={() => setModalVisible(false)}
                        isVisible={isModalVisible}
                        itemId={itemId}
                    />
                )}
            </div>
            <Link
                className={'p-2 aspect-square bg-gray-300 rounded-full transform transition-transform duration-300 hover:scale-110'}
                href={`/api/edit/${itemId}`}
            >
                <Image src={edit} alt={'info'}></Image>
            </Link>
            <Link
                className={'p-2 aspect-square bg-gray-300 rounded-full transform transition-transform duration-300 hover:scale-110'}
                href={`/api/move/${itemId}`}>
                <Image src={change} alt={'info'}></Image>
            </Link>
            {/*<Link className={'p-2 aspect-square bg-red-600 rounded-full transform transition-transform duration-300 hover:scale-110'} href={''}>*/}
            {/*    <Image src={trash} alt={'info'}></Image>*/}
            {/*</Link>*/}
        </div>
    </div>)
}

export default itemTile