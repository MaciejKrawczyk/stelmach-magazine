'use client'

import SuccessModal from "@/components/SuccessModal";
import config from "@/config.json";
import ToastNotification from "@/components/ToastNotification";
import React from "react";
import {sortTool} from "@/utils/sortToolShelf";
import axios from "axios/index";
import {Places} from "@/objects/Places";

const page = ({params}) => {

    const { id } = params


    const handleSubmit = async (e) => {
        e.preventDefault();



    };

    const handleChange = () => {

    }

    return <div className={'flex justify-center'}>

        <main className={'w-9/12 h-auto mb-28'}>

            <h1 className={'font-semibold text-3xl my-10 mx-auto '}>Przenoszenie przedmiotu nr {id}</h1>

            <form onSubmit={handleSubmit}>

                <div className="w-full flex justify-between">
                    <div className="w-1/3">
                        <h2 className="text-lg mb-2">Miejsce docelowe przedmiotu</h2>
                        <p className="text-zinc-500 font-light text-sm">
                            Wybierz nowe miejsce, do którego ma trafić przedmiot
                        </p>
                    </div>
                    <div className="w-1/3 text-xs">
                        <div className="flex flex-col">

                            <select
                                className="w-full border-gray-300 p-3 rounded-lg text-sm focus:border-gray-500 focus:shadow-lg transition duration-150 ease-in-out"
                                name="placeId"
                                onChange={handleChange}
                                value={5}
                            >
                                <option value="" disabled>Select a place ID</option>
                                {Places.map((place, index) => (
                                    <option key={index} disabled={place.id === 18 || place.id === 1 || place.id === 2} value={place.id} >
                                        {place.name}
                                    </option>
                                ))}
                            </select>

                            <span className="pt-3 pl-1 mb-2 text-gray-500"></span>
                        </div>
                    </div>
                </div>

            </form>


        </main>
    </div>
}

export default page