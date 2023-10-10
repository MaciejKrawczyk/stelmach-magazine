'use client'

import React, { useEffect, useState } from "react";
import axios from "axios";
import MoveItemTile from "@/src/components/MoveItemTile";
import SuccessModal from "@/src/components/form/modal/SuccessModal";
import SubmitButton from "@/src/components/submitButton";
import {PlaceNameById} from "@/src/utils/PlaceNameById";
import {useParcels} from "@/src/hooks/useParcels";
import {useItems} from "@/src/hooks/useItems";

const Page = () => {
    const [selectedItemSentCategory, setSelectedItemSentCategory] = useState<number | "">(""); // Initialize with an empty string
    const [selectedPlaceId, setSelectedPlaceId] = useState(3);
    const [rightSelectedPlaceId, setRightSelectedPlaceId] = useState(2)
    const [movedItems, setMovedItems] = useState<number[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [info, setInfo] = useState({});

    const {items, loading: itemsLoading, error: itemsError} = useItems()
    const {parcels, loading: parcelsLoading, error: parcelsError} = useParcels()

    const handleLeftChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedItemSentCategory(Number(e.target.value));
    };

    const handleItemClick = (itemId: number) => {
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
                placeId: 3,
                shelfId: null,
                from: 'poczekalnia do ostrzenia',
                to: `ostrzenia w paczce: ${PlaceNameById(selectedPlaceId)}`,
                parcelId: selectedItemSentCategory
            };

            console.log(payload);

                const promises = movedItems.map(itemId => {
                    return axios.put(`api/item/toParcel/${itemId}`, payload);
                });

                await Promise.all(promises);

            setIsClicked(false);
            setIsOpen(true);
            // setIsMounted(false);
        } catch (e) {
            console.error(e);
        }
    };

    const filteredItems = items.filter(item => item.placeId === selectedPlaceId && item.parcelId === null);

    return (
        <div className={'flex justify-center'}>

            <main className={'w-9/12 h-auto mb-28'}>

                <h1 className={'font-semibold text-3xl my-10 mx-auto '}>Dodawanie przedmiotów do paczki</h1>

                <form onSubmit={e => {
                    e.preventDefault();
                    handleSubmit();
                }}
                >
                    <div className={'w-full grid grid-cols-2 gap-1'}>

                        {/* Left column */}
                        <div className={'h-10 bg-red-600 flex items-center flex-col'}>

                            <select
                                className="w-full border-gray-300 p-3 rounded-lg text-sm focus:border-gray-500 focus:shadow-lg transition duration-150 ease-in-out"
                                name="parcelId"
                                value={selectedItemSentCategory} // Use selectedItemSentCategory here
                                onChange={handleLeftChange}
                            >
                                <option value="" disabled>Wybierz paczkę</option>
                                {parcels.map((company, index) => (
                                    <option key={index} value={company.id}>
                                        {`${company.name} => ${company.company.name}`}
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
