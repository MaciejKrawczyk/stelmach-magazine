import loadingAnimation from '../public/Dual Ring-1.4s-200px.svg'
import Image from 'next/image'
import SuccessModal from "@/components/form/modal/SuccessModal";

interface SubmitButtonProps {
    className: string
}

const SubmitButton = ({ isClicked, ...props }) => {

    const defaultStyles = `flex w-44 rounded-3xl pt-1 pb-1 px-10 ${isClicked ? 'bg-gray-500 cursor-not-allowed' : 'bg-amber-600'} text-white items-center justify-center`

    return (
        <>
            <button
                type="submit"
                disabled={isClicked}
                className={`${defaultStyles} ${props.className}`}
            >
                {isClicked ? (<Image
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