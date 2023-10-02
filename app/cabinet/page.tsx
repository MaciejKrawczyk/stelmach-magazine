'use client'

import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import Image from "next/image";
import loadingSVG from "@/public/Dual Ring-1.5s-191px.svg";
import tool from '@/public/small-tool.svg'
import SubmitButton from "@/components/submitButton";
import Link from "next/link";
import SuccessModal from "@/components/form/modal/SuccessModal";
import {useRouter} from "next/navigation";
import MoveItemForm from "@/components/MoveItemForm";

const page = () => {
    const [categories, setCategories] = useState([])
    const [items, setItems] = useState([])
    const [shelves, setShelves] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isClicked, setIsClicked] = useState(false)
    const [clickedShelves, setClickedShelves] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalPosition, setModalPosition] = useState({x: 0, y: 0});
    const [selectedShelf, setSelectedShelf] = useState(null); // To store the clicked shelf details
    const modalRef = useRef(null);
    const [modalState, setModalState] = useState('exited'); // new state to manage the modal transition
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [isRadioChecked, setIsRadioChecked] = useState(false);
    const [showItemOptionsModal, setShowItemOptionsModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedItemId, setSelectedItemId] = useState(null);

    const [isOpen, setIsOpen] = useState(false)
    const [object, setObject] = useState([]);

    const [isMoveItemFormOpen, setIsMoveItemFormOpen] = useState(false)

    const [fromTo, setFromTo] = useState({
        from: 1,
        to: ''
    })

    const router = useRouter()

    useEffect(() => {
        setIsClicked(false)
        fetchData();
    }, []);

    const takeout = async () => {
        if (confirm("Czy na pewno chcesz wyjąć z szafy przedmiot?")) {
            setIsClicked(true)
            setIsOpen(false)
            try {
                const result = await axios.put(`/api/item/takeout/${selectedItem.id}`)
                setIsClicked(false)
                setIsOpen(true)
                setObject(result)
                fetchData();
            } catch (e) {
                console.error(e)
            }
        }
    }

    const handleItemOptionsClick = (item) => {
        setSelectedItem(item);
        setShowItemOptionsModal(true);
    };

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/shelf', {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                }
            });
            const responseItem = await axios.get('/api/item', {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                }
            })
            const responseCategory = await axios.get('/api/shelf-category', {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                }
            })
            console.log(response.data)
            console.log(responseItem.data)
            console.log(responseCategory.data)
            setShelves(response.data);
            setItems(responseItem.data)
            setCategories(responseCategory.data)
            setLoading(false);
        } catch (e) {
            console.error('Failed to fetch data:', e);
            setError(e);
            setLoading(false);
        }
    };

    const handleApply = async (e) => {
        setIsClicked(true)

        if (isRadioChecked === false) {
            alert("Zaznacz kategorię!")
            setIsClicked(false)
        }

        e.preventDefault(); // to prevent the form from submitting and refreshing the page
        const result = {
            selectedShelves: clickedShelves,
            selectedCategoryId: selectedCategoryId
        };
        try {
            const payload = {categoryId: result.selectedCategoryId}

            const update = async () => {
                for (let i = 0; i < result.selectedShelves.length; i++) {
                    const shelf = await axios.put(`/api/shelf/${result.selectedShelves[i]}`, payload)
                    console.log(`/api/shelf/${result.selectedShelves[i]}`)
                    console.log(result.selectedCategoryId)
                    console.log(shelf.data)
                }
            }
            await update();
            // Call fetchData after successfully updating the data
            fetchData();
            setIsClicked(false)
        } catch (e) {
            console.error(e)
        }
        setClickedShelves([])
    }

    const onRightClick = (event, shelf) => {
        event.preventDefault(); // Prevent the default right-click menu
        setShowModal(true); // Show the modal
        setModalPosition({x: event.clientX, y: event.clientY}); // Get the position of the cursor
        setSelectedShelf(shelf); // Store the shelf data
        setShowItemOptionsModal(false)
        setSelectedItemId(null)
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

    const handleShelfClick = (shelfId) => {
        // Check if the shelfId is already in the list
        if (!clickedShelves.includes(shelfId)) {
            setClickedShelves(prev => [...prev, shelfId]);
        } else {
            // If the shelfId is already in the list, remove it (toggle behavior)
            setClickedShelves(prev => prev.filter(id => id !== shelfId));
        }
    }

    // const modalRef = useRef(null);
    const itemOptionsModalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target) &&
                (!itemOptionsModalRef.current || !itemOptionsModalRef.current.contains(event.target))) {
                setShowModal(false);
                setShowItemOptionsModal(false); // Close both modals if clicked outside
            }
        }

        if (showModal || showItemOptionsModal) {
            window.addEventListener('click', handleClickOutside);
        }

        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, [showModal, showItemOptionsModal]);


    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">
            <Image priority alt={'loading...'} src={loadingSVG}/>
        </div>
    }

    if (error) {
        return <div>Error loading data</div>;
    }

    async function deleteItem() {

        try {
            const object = await axios.delete(`/api/item/${selectedItemId}`)
            fetchData();
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
                objectData={object}
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
                                    .filter(shelf => shelf.name >= 1 && shelf.name <= 80 && shelf.size === "small")
                                    .map(shelf => (
                                        <div
                                            onClick={() => handleShelfClick(shelf.id)}
                                            className={`cursor-pointer flex items-center justify-center py-1 ${clickedShelves.includes(shelf.id) ? 'border-black border-2' : ''}`}
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
                                    .filter(shelf => shelf.name >= 1 && shelf.name <= 72 && shelf.size === "big")
                                    .map(shelf => (
                                        <div
                                            onClick={() => handleShelfClick(shelf.id)}
                                            className={`cursor-pointer flex items-center justify-center ${clickedShelves.includes(shelf.id) ? 'border-black border-2' : ''}`}
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
                                    .filter(shelf => shelf.name >= 81 && shelf.name <= 160 && shelf.size === "small")
                                    .map(shelf => (
                                        <div
                                            onClick={() => handleShelfClick(shelf.id)}
                                            className={`cursor-pointer flex items-center justify-center py-1 ${clickedShelves.includes(shelf.id) ? 'border-black border-2' : ''}`}
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
                        {/*<h2>Kategorie</h2>*/}
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
                        {/*<button type="submit">apply</button>*/}
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
                    <p>Szuflada nr {selectedShelf.name} ({selectedShelf.size})</p>
                        {selectedShelf.item.map((item) => {
                            return (
                                <div onClick={() => {
                                    handleItemOptionsClick(item)
                                    setSelectedItemId(item.id === selectedItemId ? null : item.id);  // Toggle selection
                                }} className={`flex cursor-pointer bg-blue-500 pr-4 pl-4 py-1 items-center justify-between w-full mt-1 mb-1 rounded-full text-xs text-white ${item.id === selectedItemId ? 'bg-red-500' : 'bg-blue-500'}`}
                                     key={item.id}>
                                    <div className={''}>{item.itemType.name}</div>
                                    <div className={''}>-></div>
                                </div>
                            )
                        })}
                    <hr/>
                    {selectedShelf.item.length === 0 ? <Link className={'flex items-center pl-8 pr-16 pt-4 pb-4 transition-colors duration-200 hover:bg-gray-200'} href={'/'}>
                        <Image priority src={tool} alt={'stelmach logo'} />
                        <span className="ml-4">Wsadź</span>
                    </Link> : null}

                </div>
            )}

            {isMoveItemFormOpen && <MoveItemForm id={selectedItem.id}/>}

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
                    <p className={'text-center font-semibold'}>{selectedItem.itemType.name}, id: {selectedItem.id}</p>
                    <p className={'text-center text-gray-500 font-light my-2'}>{selectedItem.name}</p>
                    <hr/>

                    {selectedItem.attributeValue.map((attribute) => {
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
                        // href={`/move/${selectedItem.id}`}
                    >
                        <Image priority src={tool} alt={'stelmach logo'} />
                        <span className="ml-4">Przenieś</span>
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



export default page