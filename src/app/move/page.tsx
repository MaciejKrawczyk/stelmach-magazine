'use client'

import React, { useState } from "react";
import { Places } from "@/src/objects/Places";
import axios from "axios";
import MoveItemTile from "@/src/components/MoveItemTile";
import SuccessModal from "@/src/components/form/modal/SuccessModal";
import SubmitButton from "@/src/components/submitButton";
import {sortToolExisting} from "@/src/utils/sortToolExisting";
import {PlaceNameById} from "@/src/utils/PlaceNameById";
import {useItems} from "@/src/hooks/useItems";

const Page = () => {

    const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);
    const [movedItems, setMovedItems] = useState<number[]>([]);
    const [rightSelectedPlaceId, setRightSelectedPlaceId] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState(false)
    const [isClicked, setIsClicked] = useState(false)
    const [object, setObject] = useState<any[]>([])
    const [info, setInfo] = useState({})
    const [from, setFrom] = useState('')
    const {items, loading, error} = useItems()

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedPlaceId(Number(e.target.value));
        setFrom(e.target.value)
    };

    const handleRightChange = (e: React.ChangeEvent<HTMLSelectElement>) => { // Added this function
        setRightSelectedPlaceId(Number(e.target.value));
    };

    const handleItemClick = (itemId: number) => {
        setMovedItems(prevItems =>
            prevItems.includes(itemId) ?
                prevItems.filter(id => id !== itemId) :
                [...prevItems, itemId]
        );
    };

    const handleSubmit = async (): Promise<void> => {
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
                shelfId: null,
                from: PlaceNameById(from),
                to: PlaceNameById(rightSelectedPlaceId),
                parcelId: null
            };

            if (rightSelectedPlaceId === 1) {
                let updatedInfo: { [key: string]: number } = {};

                const processItem = async (itemId: number): Promise<void> => {
                    const itemWithData: { data: IDbResponseItem } = await axios.get(`/api/item/${itemId}`);
                    const shelfId = await sortToolExisting(
                        itemWithData.data.shelfSize,
                        1,
                        itemWithData.data.itemTypeId,
                        itemWithData.data.attributeValue
                    );

                    payload.shelfId = shelfId.shelfId;

                    await axios.put(`api/item/toMagazine/${itemId}`, payload);

                    updatedInfo[itemWithData.data.name] = shelfId.shelfId;
                };

                for (const itemId of movedItems) {
                    await processItem(itemId);
                }

                setInfo(updatedInfo);
            } else {
                const promises = movedItems.map((itemId: number) => {
                    return axios.put(`api/item/move/${itemId}`, payload);
                });

                await Promise.all(promises);
            }

            setIsClicked(false);
            setIsOpen(true);
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

export default Page;
