import Image from 'next/image'
import loadingSVG from "@/public/Dual Ring-1.5s-191px.svg";

export default function Loading() {
    return <div className="flex justify-center items-center min-h-screen">
        <Image priority alt={'loading...'} src={loadingSVG} />
    </div>
}