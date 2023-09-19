'use client'

import React, { useEffect, useState } from "react";
import { Places } from "@/objects/Places";
import axios from "axios";
import MoveItemTile from "@/components/MoveItemTile";
import SuccessModal from "@/components/SuccessModal";
import {sortTool} from "@/utils/sortToolShelf";
import SubmitButton from "@/components/submitButton";
import {sortToolExisting} from "@/utils/sortToolExisting";
import {PlaceNameById} from "@/utils/PlaceNameById";

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

    const [from, setFrom] = useState('')

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
        setFrom(Number(e.target.value))
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
            setIsClicked(true);

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
                shelfId: -1,
                from: PlaceNameById(from),
                to: PlaceNameById(rightSelectedPlaceId)
            };

            console.log(payload);

            if (rightSelectedPlaceId === 1) {
                let updatedInfo = {};

                // Create a new async function to handle the entire process for each item
                const processItem = async itemId => {
                    const itemWithData = await axios.get(`/api/item/${itemId}`);
                    // console.log('pobrane itemWithData');

                    const shelfId = await sortToolExisting(
                        itemWithData.data.shelfType,
                        1,
                        itemWithData.data.itemTypeId,
                        itemWithData.data.attributeValue
                    );
                    // console.log('sortTool zrobiony');

                    payload.shelfId = shelfId.shelfId;

                    console.log('do payloudu dodane nowy shelfId');

                    const result = await axios.put(`api/item/move/${itemId}`, payload);
                    console.log('result zroniony');

                    updatedInfo[itemWithData.data.name] = shelfId.shelfId;

                    return result;  // if needed
                };

                // Use a for...of loop to ensure sequential execution for each item
                for (const itemId of movedItems) {
                    await processItem(itemId);
                }

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
                }}
                >
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
                                    attributes={item.attributeValue}
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
                                    <option key={index} value={place.id} disabled={selectedPlaceId === place.id || place.id === 18 || place.id === -1 || place.id === 2}>
                                        {place.name}
                                    </option>
                                ))}
                            </select>


                            {filteredItems.filter(item => movedItems.includes(item.id)).map(item => (
                                <MoveItemTile
                                    key={item.id}
                                    attributes={item.attributeValue}
                                    itemType={item.itemType.name}
                                    name={item.name}
                                    company={item.company.name}
                                    description={item.description}
                                    onClick={() => handleItemClick(item.id)}
                                />
                            ))}

                            <SubmitButton isClicked={isClicked} />

                        </div>
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
