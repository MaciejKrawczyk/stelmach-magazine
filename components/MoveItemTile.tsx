'use client'

import Image from "next/image";
import info from "@/public/Info_alt_light.svg";
import scan from "@/public/Scan_alt_2.svg";
import user from "@/public/Company.svg";
import meatballs from "@/public/Meatballs_menu.svg";
import React from "react";

const MoveItemTile = ({itemType, name, company, description, ...props}) => {
    return (
        <div
            className={`cursor-pointer p-5 w-full my-2 h-auto bg-gray-100 hover:bg-gray-200 flex flex-col border-gray-200 rounded-xl shadow-item`}
            {...props}
        >
            <div className={'flex justify-between w-full'}>
                <div className={'bg-blue-500 py-1 px-5 text-white rounded-full'}>
                    {itemType}
                </div>
                {/*<Image src={meatballs} alt={'info'}></Image>*/}
            </div>
            <hr className={'my-2'}/>

            <div className={'grid grid-cols-2 gap-3 justify-start w-full'}>
                <div className={'flex'}>
                    <Image className={'mr-3'} src={scan} alt={'info'}></Image>
                    <span className={'text-gray-400'}>{name.length > 19 ? name.substring(0, 19) + '...' : name}</span>
                </div>
                <div className={'flex'}>
                    <Image className={'mr-3'}  src={user} alt={'info'}></Image>
                    <span className={'text-gray-400'}>{company}</span>
                </div>

                <div className={'flex'}>
                    <Image className={'mr-3'}  src={info} alt={'info'}></Image>
                    <span className={'text-gray-400'}>{description}</span>
                </div>
            </div>
        </div>
    );
}

export default MoveItemTile;
