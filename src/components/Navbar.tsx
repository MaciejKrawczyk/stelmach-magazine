'use client'

import React, { useState } from 'react';
import Image from 'next/image';

import stelmachLogo from '../../public/stelmach-logo.svg';
import arrowDown from '../../public/arrow-down.svg';
import producer from '../../public/producent.svg'
import move from '../../public/move.svg'
import shelf from '../../public/shelf.svg'
import tool from '../../public/tool.svg'
import type from '../../public/type.svg'

import config from '../../config.json';
import Link from "next/link";


const icons = {
    'producer': producer,
    'move': move,
    'shelf': shelf,
    'tool': tool,
    'type': type
}


const Navbar = () => {
    const [hoveredLink, setHoveredLink] = useState(null);

    const expandableStyles = 'flex flex-row items-center px-10 mr-6 text-white text-base font-normal rounded-3xl p-2 hover:bg-stone-500 transition duration-200 cursor-pointer ease-in-out';
    const nonExpandableStyles = 'flex flex-row items-center px-10 text-white text-base font-normal rounded-3xl p-2 hover:bg-stone-500 transition duration-200 cursor-pointer ease-in-out';

    return (
        <>
            <nav className={'bg-stone-800 flex flex-row items-center h-24'}>

                <div className={'pl-10 pr-10'}>
                    <Link href={'/'}>
                        <Image priority src={stelmachLogo} alt={'stelmach logo'} />
                    </Link>
                </div>

                <hr className={'h-12 border-l border-gray-500'} />

                <ul className={'flex flex-row w-1/2 justify-around items-center text-white pl-6 pr-6 relative'}>
                    {config.ui.navbar.links.map((link, index) => {

                        const isExpandable = config.ui.navbar.links[index].expandable.length !== 0;

                        return (
                            <div
                                onMouseEnter={() => setHoveredLink(link.id)}
                                onMouseLeave={() => setHoveredLink(null)}
                                key={link.id}
                                className="relative"
                            >
                                {isExpandable ? (
                                    <div className={nonExpandableStyles} onClick={() => { /* Handle click if needed */ }}>
                                        <div>{link.name}</div>
                                        <div className={'pl-2 pr-0'}>
                                            <Image priority src={arrowDown} alt={'arrow down'} />
                                        </div>
                                    </div>
                                ) : (
                                    <Link href={link.url}>
                                        <li className={nonExpandableStyles}>
                                            <div>{link.name}</div>
                                        </li>
                                    </Link>
                                )}

                                {hoveredLink === link.id && isExpandable && (
                                    <div className="rounded-xl p-5 absolute top-full transform -translate-x-1/5 w-120 h-auto z-10 bg-white transition-transform duration-200 flex flex-row flex-wrap justify-start">
                                        {config.ui.navbar.links[index].expandable.map((menuLink, linkIndex) => {
                                            return (
                                                <Link href={menuLink.url} key={menuLink.id}>
                                                    <div className="rounded-xl pt-3 pb-3 pl-3 my-2 mx-2 pr-10 w-64 h-auto flex flex-col flex-nowrap bg-stone-200 text-black hover:bg-green-200">
                                                        <div className="flex flex-row space-x-4 items-center m-2">
                                                            <div className={'p-3 rounded-full bg-stone-300'}>
                                                                <Image
                                                                    priority
                                                                    src={icons[menuLink.icon]}
                                                                    alt={menuLink.alt}
                                                                />
                                                            </div>

                                                            <div>
                                                                <div className="text-black text-base font-normal">
                                                                    {menuLink.name}
                                                                </div>

                                                                <div className="text-gray-600 text-sm font-light">
                                                                    {menuLink.description}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </ul>

            </nav>
        </>
    );
};

export default Navbar;
