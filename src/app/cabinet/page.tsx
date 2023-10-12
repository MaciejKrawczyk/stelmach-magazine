'use client'

import React, {useEffect, useRef, useState} from "react";
import axios, {AxiosResponse} from "axios";
import Image from "next/image";
import loadingSVG from "@/public/Dual Ring-1.5s-191px.svg";
import tool from '@/public/small-tool.svg'
import SubmitButton from "@/src/components/submitButton";
import Link from "next/link";
import SuccessModal from "@/src/components/form/modal/SuccessModal";
import MoveItemForm from "@/src/components/MoveItemForm";
import {useShelfCategories} from "@/src/hooks/useShelfCategories";
import {useShelves} from "@/src/hooks/useShelves";
import {useItems} from "@/src/hooks/useItems";

type ModalPosition = { x: number; y: number; };
type Shelf = IDbResponseShelf;
type Item = IDbResponseItem;
type Result = { selectedShelves: string[]; selectedCategoryId: number | null; }

const Page: React.FC = () => {
    const [isClicked, setIsClicked] = useState<boolean>(false);
    const [clickedShelves, setClickedShelves] = useState<string[]>([]); // Assuming shelfId is a string
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalPosition, setModalPosition] = useState<ModalPosition>({ x: 0, y: 0 });
    const [selectedShelf, setSelectedShelf] = useState<Shelf | null>(null);
    const modalRef = useRef<HTMLDivElement | null>(null);
    const [modalState, setModalState] = useState<string>('exited'); // Consider using an enum
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null); // Assuming categoryId is a string
    const [isRadioChecked, setIsRadioChecked] = useState<boolean>(false);
    const [showItemOptionsModal, setShowItemOptionsModal] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null); // Assuming itemId is a string
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [object, setObject] = useState<any[]>([]); // Please replace 'any' with a more specific type
    const [isMoveItemFormOpen, setIsMoveItemFormOpen] = useState<boolean>(false);
    const itemOptionsModalRef = useRef<HTMLDivElement | null>(null);


    const { items, loading: itemsLoading, error: itemsError, refetch: refetchItems } = useItems();
    const { shelves, loading: shelvesLoading, error: shelvesError, refetch: refetchShelves } = useShelves();
    const { shelfCategories: categories, loading: categoriesLoading, error: categoriesError, refetch: refetchCategories } = useShelfCategories();


    useEffect(() => {
        setIsClicked(false)
        // fetchData();
    }, []);

    const takeout = async () => {
        if (confirm("Czy na pewno chcesz wyjąć z szafy przedmiot?")) {
            setIsClicked(true)
            setIsOpen(false)
            if (selectedItem) { // Add this check
                try {
                    const result: AxiosResponse = await axios.put(`/api/item/takeout/${selectedItem.id}`)
                    setIsClicked(false)
                    setIsOpen(true)
                    setObject(result.data)
                    refetchCategories()
                    refetchItems()
                    refetchShelves()
                } catch (e) {
                    console.error(e)
                }
            }
        }
    }

    const handleItemOptionsClick = (item: IDbResponseItem) => {
        setSelectedItem(item);
        setShowItemOptionsModal(true);
    };

    const handleApply = async (e: React.FormEvent<HTMLFormElement>) => {
        setIsClicked(true);

        if (isRadioChecked === false) {
            alert("Zaznacz kategorię!");
            setIsClicked(false);
        }

        e.preventDefault();
        const result: Result = {
            selectedShelves: clickedShelves,
            selectedCategoryId: selectedCategoryId
        };

        try {
            const payload = { categoryId: result.selectedCategoryId };

            const update = async () => {
                for (let i = 0; i < result.selectedShelves.length; i++) {
                    await axios.put(`/api/shelf/${result.selectedShelves[i]}`, payload);
                }
            }
            await update();

            refetchItems();
            refetchShelves();
            refetchCategories();

            setIsClicked(false);
        } catch (e: any) {
            console.error(e);
        }
        setClickedShelves([]);
    }

    const onRightClick = (event: React.MouseEvent<HTMLElement>, shelf: any) => {
        event.preventDefault();
        setShowModal(true);
        setModalPosition({ x: event.clientX, y: event.clientY });
        setSelectedShelf(shelf);
        setShowItemOptionsModal(false);
        setSelectedItemId(null);
    }

    useEffect(() => {
        if (showModal && modalState === 'exited') {
            setModalState('entering');
            setTimeout(() => setModalState('entered'), 200);
        } else if (!showModal && modalState === 'entered') {
            setModalState('exiting');
            setTimeout(() => setModalState('exited'), 200);
        }
    }, [showModal, modalState]);

    const handleShelfClick = (shelfId: string) => {
        if (!clickedShelves.includes(shelfId)) {
            setClickedShelves(prev => [...prev, shelfId]);
        } else {
            setClickedShelves(prev => prev.filter(id => id !== shelfId));
        }
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node) &&
                (!itemOptionsModalRef.current || !itemOptionsModalRef.current.contains(event.target as Node))) {
                setShowModal(false);
                setShowItemOptionsModal(false);
            }
        }

        if (showModal || showItemOptionsModal) {
            window.addEventListener('click', handleClickOutside);
        }

        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, [showModal, showItemOptionsModal]);


    if (categoriesLoading || shelvesLoading || itemsLoading) {
        return <div className="flex justify-center items-center min-h-screen">
            <Image priority alt={'loading...'} src={loadingSVG}/>
        </div>
    }

    if (categoriesError || shelvesError || itemsError) {
        return <div>Error loading data</div>;
    }

    async function deleteItem() {

        try {
            const object = await axios.delete(`/api/item/${selectedItemId}`)

            refetchShelves()
            refetchItems()
            refetchCategories()

            setShowModal(false);
            setIsClicked(false)
            setModalState('exited')
            setShowItemOptionsModal(false)
        } catch (e) {
            console.error(e)
        }
        setClickedShelves([])
    }

    return (
        <>
            <SuccessModal
                isOpen={isOpen}
                text={'przedmiot został pomyślnie wyjęty z szafy, jeśli chcesz znaleźć wyjęte narzędzia, których nie ma na żadnej pozycji, przejdź do zakładki /...'}
                objectData={{}}
                bigText={'narzędzie zostało wyjęte z szuflady!'}
            />

            <div
                className={'flex justify-center'}
            >
                <main className={'w-10/12 h-auto mb-28'}>

                    <h1 className={'font-semibold text-3xl my-10 mx-auto '}>Przegląd szafy</h1>

                    <div className={'flex'}>

                        <div className={'w-full h-auto grid grid-cols-3 relative'}> {/* Add relative here */}
                            {isClicked && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                                    <div className="flex justify-center items-center min-h-screen">
                                        <Image priority alt={'loading...'} src={loadingSVG} />
                                    </div>
                                </div>
                            )}
                        <div className={'gap-3 border-2 border-black p-3 w-auto grid grid-cols-5 grid-rows-16'}>
                            {
                                shelves
                                    .filter(shelf => Number(shelf.name) >= 1 && Number(shelf.name) <= 80 && shelf.size === "small")
                                    .map(shelf => (
                                        <div
                                            onClick={() => handleShelfClick(String(shelf.id))}
                                            className={`cursor-pointer flex items-center justify-center py-1 ${clickedShelves.includes(String(shelf.id)) ? 'border-black border-2' : ''}`}
                                            key={shelf.id}
                                            onContextMenu={(e) => onRightClick(e, shelf)} // Add this line
                                            style={{backgroundColor: shelf.shelfCategory.color}}
                                        >
                                            {/*{shelf.name}*/}
                                            {shelf.item.length > 0 && (
                                                <>
                                                    <div>{shelf.item.length}</div>
                                                    <Image src={tool} priority alt={'tool'}/>
                                                </>
                                            )}
                                        </div>
                                    ))
                            }
                        </div>
                        <div className={' gap-3 mx-3 border-2 border-black p-3 w-auto grid grid-cols-5 grid-rows-12'}>
                            {
                                shelves
                                    .filter(shelf => Number(shelf.name) >= 1 && Number(shelf.name) <= 72 && shelf.size === "big")
                                    .map(shelf => (
                                        <div
                                            onClick={() => handleShelfClick(String(shelf.id))}
                                            className={`cursor-pointer flex items-center justify-center ${clickedShelves.includes(String(shelf.id)) ? 'border-black border-2' : ''}`}
                                            key={shelf.id}
                                            onContextMenu={(e) => onRightClick(e, shelf)} // Add this line
                                            style={{backgroundColor: shelf.shelfCategory.color}}
                                        >
                                            {/*{shelf.name}*/}
                                            {shelf.item.length > 0 && (
                                                <>
                                                    <div>{shelf.item.length}</div>
                                                    <Image src={tool} priority alt={'tool'}/>
                                                </>
                                            )}
                                        </div>
                                    ))
                            }
                        </div>
                        <div className={'gap-3 border-2 border-black p-3 w-auto grid grid-cols-5 grid-rows-16'}>
                            {
                                shelves
                                    .filter(shelf => Number(shelf.name) >= 81 && Number(shelf.name) <= 160 && shelf.size === "small")
                                    .map(shelf => (
                                        <div
                                            onClick={() => handleShelfClick(String(shelf.id))}
                                            className={`cursor-pointer flex items-center justify-center py-1 ${clickedShelves.includes(String(shelf.id)) ? 'border-black border-2' : ''}`}
                                            key={shelf.id}
                                            onContextMenu={(e) => onRightClick(e, shelf)} // Add this line
                                            style={{backgroundColor: shelf.shelfCategory.color}}
                                        >
                                            {/*{shelf.name}*/}
                                            {shelf.item.length > 0 && (
                                                <>
                                                    <div>{shelf.item.length}</div>
                                                    <Image src={tool} priority alt={'tool'}/>
                                                </>
                                            )}
                                        </div>
                                    ))
                            }
                        </div>
                    </div>
                    </div>

                    <hr className={'my-5'}/>

                    <form onSubmit={handleApply}>
                        {categories.map((category) => (
                            <div key={category.id} className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="category"
                                    value={category.id}
                                    id={`category-${category.id}`}
                                    className="hidden"
                                    onChange={() => {
                                        setIsRadioChecked(true)
                                        setSelectedCategoryId(category.id)
                                    }}
                                    checked={selectedCategoryId === category.id}
                                />
                                <label
                                    htmlFor={`category-${category.id}`}
                                    className="flex items-center space-x-2 cursor-pointer"
                                >
                        <span
                            style={{
                                backgroundColor: `${category.color}`
                            }}
                            className={`w-5 h-5 bg-blue-500 rounded-full relative 
                                        ${selectedCategoryId === category.id ? 'bg-blue-500' : ''}`}
                        >
                            {selectedCategoryId === category.id && (
                                <span className="absolute inset-1/4 w-1/2 h-1/2 bg-white rounded-full"></span>
                            )}
                        </span>
                                    {category.name}
                                </label>
                            </div>
                        ))}
                        <SubmitButton disabled={isRadioChecked} isClicked={isClicked}/>
                    </form>


                </main>
            </div>

            {modalState !== 'exited' && (
                <div
                    ref={modalRef}
                    className={`p-4 w-auto flex flex-col absolute transition-opacity ease-in duration-100 ${modalState === 'entered' ? 'opacity-100' : 'opacity-0'} border border-gray-300 bg-white z-10`}
                    style={{
                        top: `${modalPosition.y}px`,
                        left: `${modalPosition.x}px`,
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <p>Szuflada nr {selectedShelf?.name} ({selectedShelf?.size})</p>
                    {selectedShelf && selectedShelf.item.map((item) => {
                            return (
                                <div onClick={() => {
                                    handleItemOptionsClick(item)
                                    setSelectedItemId(item.id === selectedItemId ? null : item.id);  // Toggle selection
                                }} className={`flex cursor-pointer bg-blue-500 pr-4 pl-4 py-1 items-center justify-between w-full mt-1 mb-1 rounded-full text-xs text-white ${item.id === selectedItemId ? 'bg-red-500' : 'bg-blue-500'}`}
                                     key={item.id}>
                                    <div className={''}>{item.itemType.name}</div>
                                    <div className={''}>-&gt;</div>
                                </div>
                            )
                        })}
                    <hr/>
                    {selectedShelf?.item.length === 0 ? <Link className={'flex items-center pl-8 pr-16 pt-4 pb-4 transition-colors duration-200 hover:bg-gray-200'} href={'/'}>
                        <Image priority src={tool} alt={'stelmach logo'} />
                        <span className="ml-4">Wsadź</span>
                    </Link> : null}

                </div>
            )}

            {isMoveItemFormOpen && <MoveItemForm id={selectedItem?.id}/>}

            {showItemOptionsModal && (
                <div
                    ref={itemOptionsModalRef}
                    className="p-4 w-auto flex flex-col absolute z-20 border border-gray-300 bg-white"
                    style={{
                        top: `${modalPosition.y + 40}px`,
                        left: `${modalPosition.x + 200}px`
                    }}
                    onClick={(e) => e.stopPropagation()} // This prevents the event from reaching the handleClickOutside
                >
                    <p className={'text-center font-semibold'}>{selectedItem?.itemType.name}, id: {selectedItem?.id}</p>
                    <p className={'text-center text-gray-500 font-light my-2'}>{selectedItem?.name}</p>
                    <hr/>

                    {selectedItem?.attributeValue.map((attribute) => {
                        return (
                            <p key={attribute.id}>{attribute.typeAttribute.name}: {attribute.value}</p>
                        )
                    })}

                    <div
                        className={'cursor-pointer flex items-center pl-8 pr-16 pt-4 pb-4 transition-colors duration-200 hover:bg-gray-200'}
                        onClick={takeout}
                    >
                        <Image priority src={tool} alt={'stelmach logo'} />
                        <span className="ml-4">Wyjmij</span>
                    </div>
                    <div
                        onClick={() => setIsMoveItemFormOpen(true)}
                        className={'cursor-pointer flex items-center pl-8 pr-16 pt-4 pb-4 transition-colors duration-200 hover:bg-gray-200'}
                    >
                        <Image priority src={tool} alt={'stelmach logo'} />
                        <span className="ml-4">Przenieś</span>
                    </div>
                    <div
                      onClick={() => {}}
                      className={'cursor-pointer flex items-center pl-8 pr-16 pt-4 pb-4 transition-colors duration-200 hover:bg-gray-200'}
                    >
                        <Image priority src={tool} alt={'stelmach logo'} />
                        <span className="ml-4">zmień szufladę</span>
                    </div>
                    <hr/>
                    <div
                        onClick={() => deleteItem()}
                        className={'cursor-pointer flex items-center pl-8 pr-16 pt-4 pb-4 transition-colors duration-200 hover:bg-red-200'}
                    >
                        <Image priority src={tool} alt={'stelmach logo'} />
                        <span className="ml-4">Usuń</span>
                    </div>
                </div>
                )
            }
        </>
    )
}

export default Page