import React, { useState, useEffect } from 'react';
import '../public/SuccessModal.css';
import { useRouter } from 'next/navigation';
import Link from "next/link";



const SuccessModalWithoutAnimation = ({ text, bigText, isOpen, objectData }) => {
    const router = useRouter();

    // Use local state to manage modal visibility
    const [isVisible, setIsVisible] = useState(isOpen);

    useEffect(() => {
        setIsVisible(isOpen);
    }, [isOpen]);

    const onClose = () => {
        setIsVisible(false);
        router.refresh()
    }

    return (
        <div className={`fixed top-0 left-0 w-full h-full transition-opacity duration-300 bg-black bg-opacity-50 flex items-center justify-center ${isVisible ? 'opacity-100 z-50' : 'opacity-0 pointer-events-none'}`}>
            <dialog open={isVisible} className="relative h-auto w-auto p-14 bg-white rounded-3xl shadow-lg transition-transform duration-300 transform ${isVisible ? 'scale-100' : 'scale-90'}">

                <h2 className={"text-3xl text-gray-800 font-bold m-3 flex justify-center"} >Udało się!</h2>

                <h3 className={'text-xl flex justify-center'}>{bigText}</h3>

                <p className={'justify-center flex font-extralight mb-10 ml-auto mr-auto mt-auto text-center w-10/12'}>{text}</p>


                <form className={'flex justify-between'} method={'dialog'}>
                    {/*<Link href={'/cabinet'} onClick={onClose} type="button" className="m-2 px-4 py-2 bg-blue-500 w-full text-white rounded-md">OK</Link>*/}
                    <a href={'/cabinet'} type="button" className="m-2 px-4 w-full py-2 bg-gray-300 rounded-md">OK</a>
                </form>
            </dialog>
        </div>
    );
};

export default SuccessModalWithoutAnimation;
