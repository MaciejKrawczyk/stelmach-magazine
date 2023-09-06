import loadingAnimation from '../public/Dual Ring-1.4s-200px.svg'
import Image from 'next/image'

const SubmitButton = (props) => {

    const {isClicked} = props;

    return (
        <button
            type="submit"
            className={`flex w-44 rounded-3xl pt-1 pb-1 px-10 ${isClicked ? 'bg-gray-500 cursor-not-allowed' : 'bg-amber-600'} text-white items-center justify-center`}
            disabled={isClicked}
        >
            {isClicked ? (<Image
                width={25}
                alt="loading..."
                priority
                src={loadingAnimation}
            />) : "Dodaj"}
        </button>
    );
}

export default SubmitButton