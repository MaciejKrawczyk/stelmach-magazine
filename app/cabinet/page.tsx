'use client'
import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import Image from "next/image";
import loadingSVG from "@/public/Dual Ring-1.5s-191px.svg";
import tool from '@/public/small-tool.svg'
import {useRouter} from "next/navigation";
import SubmitButton from "@/components/submitButton";
import Link from "next/link";
import stelmachLogo from "@/public/stelmach-logo.svg";

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

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/shelf');
            const responseItem = await axios.get('/api/item')
            const responseCategory = await axios.get('/api/category')
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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setShowModal(false);
            }
        }

        if (showModal) {
            window.addEventListener('click', handleClickOutside);
        }

        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, [showModal]); // Dependency on showModal

    useEffect(() => {
        setIsClicked(false)
        fetchData();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">
            <Image priority alt={'loading...'} src={loadingSVG}/>
        </div>
    }

    if (error) {
        return <div>Error loading data</div>;
    }

    // const onSubmit = () => {
    //
    // }


    return (
        <>
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
                                            style={{backgroundColor: shelf.category.color}}
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
                                            style={{backgroundColor: shelf.category.color}}
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
                                            style={{backgroundColor: shelf.category.color}}
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
                                    onChange={() => setSelectedCategoryId(category.id)}
                                    checked={selectedCategoryId === category.id}
                                />
                                <label
                                    htmlFor={`category-${category.id}`}
                                    className="flex items-center space-x-2 cursor-pointer"
                                >
                        <span
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
                        <SubmitButton isClicked={isClicked}/>
                    </form>


                </main>
            </div>

            {modalState !== 'exited' && (
                <div
                    ref={modalRef}
                    className={`p-4 flex flex-col absolute transition-opacity ease-in duration-100 ${modalState === 'entered' ? 'opacity-100' : 'opacity-0'} border border-gray-300 bg-white z-10`}
                    style={{
                        top: `${modalPosition.y}px`,
                        left: `${modalPosition.x}px`,
                    }}
                    onClick={() => setShowModal(false)}
                >
                    <p>Szuflada nr {selectedShelf.name} ({selectedShelf.size})</p>
                    {selectedShelf.item.map((item) => {
                        return (
                            <div className={'flex bg-blue-500 pr-4 pl-4 py-1 items-center justify-between w-full mt-1 mb-1  rounded-full text-xs text-white'} key={item.id}>
                                <div className={''}>{item.itemType.name}</div>
                                <div className={''}>?</div>
                            </div>
                        )
                    })}
                    <hr/>
                    <Link className={'flex items-center pl-8 pr-16 pt-4 pb-4 transition-colors duration-200 hover:bg-gray-200'} href={'/'}>
                        <Image priority src={tool} alt={'stelmach logo'} />
                        <span className="ml-4">Wyjmij</span>
                    </Link>
                    <Link className={'flex items-center pl-8 pr-16 pt-4 pb-4 transition-colors duration-200 hover:bg-gray-200'} href={'/'}>
                        <Image priority src={tool} alt={'stelmach logo'} />
                        <span className="ml-4">Wsadź</span>
                    </Link>
                    <Link className={'flex items-center pl-8 pr-16 pt-4 pb-4 transition-colors duration-200 hover:bg-gray-200'} href={'/'}>
                        <Image priority src={tool} alt={'stelmach logo'} />
                        <span className="ml-4">Prznieś</span>
                    </Link>
                    <hr/>
                    <Link className={'flex items-center pl-8 pr-16 pt-4 pb-4 transition-colors duration-200 hover:bg-red-200'} href={'/'}>
                        <Image priority src={tool} alt={'stelmach logo'} />
                        <span className="ml-4">Usuń</span>
                    </Link>
                </div>
            )}


        </>
    )
}
export default page