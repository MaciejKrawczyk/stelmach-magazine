'use client'

import React, { useEffect, useState } from "react";
import { Places } from "@/objects/Places";
import axios from "axios";
import MoveItemTile from "@/components/MoveItemTile";
import SuccessModal from "@/components/SuccessModal";
import {sortToolShelfMultiple} from "@/utils/sortToolShelfMultiple";
import {sortTool} from "@/utils/sortToolShelf";
import SubmitButton from "@/components/submitButton";

const page = () => {
    const [items, setItems] = useState([]);
    const [selectedPlaceId, setSelectedPlaceId] = useState(null);
    const [movedItems, setMovedItems] = useState([]);
    const [rightSelectedPlaceId, setRightSelectedPlaceId] = useState(null);  // Added this

    const [isOpen, setIsOpen] = useState(false)
    const [isClicked, setIsClicked] = useState(false)
    const [object, setObject] = useState([])

    const [isMounted, setIsMounted] = useState(false)
    const [info, setInfo] = useState({})

    useEffect(() => {
        const fetchData = async () => {
            try {
                const itemsResponse = await axios.get('/api/item');
                setItems(itemsResponse.data);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchData();
        setIsMounted(true)
    }, [isMounted]);

    const handleChange = (e) => {
        setSelectedPlaceId(Number(e.target.value));
    };

    const handleRightChange = (e) => { // Added this function
        setRightSelectedPlaceId(Number(e.target.value));
    };

    const handleItemClick = (itemId) => {
        // @ts-ignore
        setMovedItems(prevItems =>
            prevItems.includes(itemId) ?
                prevItems.filter(id => id !== itemId) :
                [...prevItems, itemId]
        );
    };

    const handleSubmit = async () => {
        try {
            setIsOpen(false);
            setIsClicked(false);

            if (movedItems.length === 0) {
                alert('musisz przenieść co najmniej jedno narzędzie aby zatwierdzić');
                return;
            }

            if (rightSelectedPlaceId === null) {
                alert('musisz wybrać kategorię zanim zawierdzisz');
                return;
            }

            if (!confirm('Czy na pewno chcesz przenieść przedmioty?')) {
                return;
            }

            const payload = {
                placeId: rightSelectedPlaceId,
                shelfId: -1
            };

            console.log(payload);

            if (rightSelectedPlaceId === 1) {
                let updatedInfo = {};

                const promises = movedItems.map(async itemId => {
                    const itemWithData = await axios.get(`/api/item/${itemId}`);
                    const shelfId = await sortTool(itemWithData.data.shelfType, 1, itemWithData.data.itemTypeId);

                    payload.shelfId = shelfId.shelfId;
                    const result = await axios.put(`api/item/move/${itemId}`, payload);

                    updatedInfo[itemWithData.data.name] = shelfId.shelfId;

                    return result;  // if needed
                });

                await Promise.all(promises);

                setInfo(updatedInfo);
            } else {
                const promises = movedItems.map(itemId => {
                    console.log('nie magazyn');
                    return axios.put(`api/item/move/${itemId}`, payload);
                });

                await Promise.all(promises);
            }

            setIsClicked(false);
            setIsOpen(true);
            setIsMounted(false);
        } catch (e) {
            console.error(e);
        }
    };



    const filteredItems = items.filter(item => item.placeId === selectedPlaceId);

    return (
        <div className={'flex justify-center'}>

            <main className={'w-9/12 h-auto mb-28'}>
                <h1 className={'font-semibold text-3xl my-10 mx-auto '}>Przenoszenie przedmiotu</h1>
                <form onSubmit={e => {
                    e.preventDefault();
                    handleSubmit();
                }}>
                    <div className={'w-full grid grid-cols-2 gap-1'}>

                        {/* Left column */}
                        <div className={'h-10 bg-red-600 flex items-center flex-col'}>

                            <select
                                className="w-1/2 border-gray-300 p-3 text-sm focus:border-gray-500 focus:shadow-lg transition duration-150 ease-in-out"
                                name="placeId"
                                onChange={handleChange}
                                value={selectedPlaceId || ""}
                            >
                                <option value="" disabled>Select a place ID</option>
                                {Places.map((place, index) => (
                                    <option key={index} value={place.id} disabled={place.id===18}>
                                        {place.name}
                                    </option>
                                ))}
                            </select>

                            {filteredItems.filter(item => !movedItems.includes(item.id)).map(item => (
                                <MoveItemTile
                                    key={item.id}
                                    itemType={item.itemType.name}
                                    name={item.name}
                                    company={item.company.name}
                                    description={item.description}
                                    onClick={() => handleItemClick(item.id)}
                                />
                            ))}

                        </div>

                        {/* Right column */}
                        <div className={'h-10 bg-blue-500 flex items-center flex-col'}>

                            <select
                                className="w-1/2 border-gray-300 p-3 text-sm focus:border-gray-500 focus:shadow-lg transition duration-150 ease-in-out"
                                name="rightPlaceId"
                                onChange={handleRightChange}
                                value={rightSelectedPlaceId || ""}
                            >
                                <option value="" disabled>Select a place ID</option>
                                {Places.map((place, index) => (
                                    <option key={index} value={place.id} disabled={selectedPlaceId === place.id || place.id === 18 || place.id === -1 || place.id === 2 || place.id === 3}>
                                        {place.name}
                                    </option>
                                ))}
                            </select>


                            {filteredItems.filter(item => movedItems.includes(item.id)).map(item => (
                                <MoveItemTile
                                    key={item.id}
                                    itemType={item.itemType.name}
                                    name={item.name}
                                    company={item.company.name}
                                    description={item.description}
                                    onClick={() => handleItemClick(item.id)}
                                />
                            ))}
                        </div>
                        <SubmitButton isClicked={isClicked} />
                    </div>
                </form>
            </main>

            <SuccessModal
                isOpen={isOpen}
                text={'przedmiot został przeniesiony'}
                objectData={info}
                bigText={'Przeniesiono'}
            />

        </div>
    );
}

export default page;
