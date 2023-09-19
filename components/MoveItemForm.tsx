'use client'

import React, {useState} from "react";
import {Places} from "@/objects/Places";
import {useParams, useRouter} from "next/navigation";
import LinkModal from "@/components/LinkModal";
import SubmitButton from "@/components/submitButton";
import axios from "axios";
import SuccessModal from "@/components/SuccessModal";
import config from "@/config.json";
import SuccessModalWithoutAnimation from "@/components/SuccessModalWithoutAnimation";
import {PlaceNameById} from "@/utils/PlaceNameById";


const MoveItemForm = ({ id }) => {

    // const { id } = props

    const router = useRouter()
    // submit button
    const [isClicked, setIsClicked] = useState(false);
    // success modal
    const [isOpen, setIsOpen] = useState(false);
    const [object, setObject] = useState([]);

    const [placeId, setPlaceId] = useState(5)

    // const params = useParams()
    // const id = params.id

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsClicked(true);
        setIsOpen(false);

        try {

            const payload = {
                placeId: placeId,
                shelfId: -1,
                to: PlaceNameById(placeId),
                from: PlaceNameById(1)
            }

            const result = await axios.put(`/api/item/move/${id}`, payload)

            setObject(result.data)
            setIsOpen(true)
            setIsClicked(false)

        } catch (e) {
            console.error(e)
        }


    };

    const handleChange = (e) => {
        setPlaceId(Number(e.target.value)); // Convert the string value to a number since IDs are typically numeric
    }

    return ( <div>

    <LinkModal children={(<>

        <SuccessModalWithoutAnimation
            isOpen={isOpen}
            text={'Przeniesiono przedmiot!'}
            objectData={object}
            bigText={'Przeniesiono!'}
        />

        <div className={'flex justify-center'}>
        <main className={'w-9/12 h-auto mb-28'}>

            <h1 className={'font-semibold text-3xl my-10 mx-auto '}>Przenoszenie przedmiotu nr {id}</h1>

            <form onSubmit={handleSubmit}>

                <div className="w-full flex justify-between">
                    <div className="w-1/3">
                        <h2 className="text-lg mb-2">Miejsce docelowe przedmiotu</h2>
                        <p className="text-zinc-500 font-light text-sm">
                            Wybierz nowe miejsce, do którego ma trafić przedmiot
                        </p>
                    </div>
                    <div className="w-1/3 text-xs">
                        <div className="flex flex-col">

                            <select
                                className="w-full border-gray-300 p-3 rounded-lg text-sm focus:border-gray-500 focus:shadow-lg transition duration-150 ease-in-out"
                                name="placeId"
                                onChange={handleChange}
                                value={placeId}
                            >
                                <option value="" disabled>Select a place ID</option>
                                {Places.map((place, index) => (
                                    <option key={index} disabled={place.id === 18 || place.id === 1 || place.id === 2} value={place.id}>
                                        {place.name}
                                    </option>
                                ))}
                            </select>

                            <span className="pt-3 pl-1 mb-2 text-gray-500"></span>
                        </div>
                    </div>
                </div>

                <SubmitButton className={'mt-10'} isClicked={isClicked} />
                {/*<button type={'submit'}>Przenieś</button>*/}

            </form>


        </main>
    </div></>)} />
    </div>
)

}

export default MoveItemForm