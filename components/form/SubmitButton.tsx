'use client'

import loadingAnimation from '@/public/Dual Ring-1.4s-200px.svg'
import Image from 'next/image'

interface SubmitButtonProps {
    className: string
}

const SubmitButton = ({ pending, ...props }) => {


    const defaultStyles = `flex w-44 rounded-3xl pt-1 pb-1 px-10 ${pending ? 'bg-gray-500 cursor-not-allowed' : 'bg-amber-600'} text-white items-center justify-center`

    return (
        <>
            <button
                type={'submit'}
                disabled={pending}
                className={`${defaultStyles} ${props.className}`}
            >
                {pending ? (<Image
                    width={25}
                    alt="loading..."
                    priority
                    src={loadingAnimation}
                />) : "Dodaj"}
            </button>
        </>
    );
}

export default SubmitButton