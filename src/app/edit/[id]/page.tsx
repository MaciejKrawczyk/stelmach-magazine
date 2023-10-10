'use client'

import Container from "@/src/components/Container";
import React, {useState} from "react";
import {useItem} from "@/src/hooks/useItem";
import {useParams} from "next/navigation";
import SubmitButton from "@/src/components/form/SubmitButton";
import Image from "next/image";
import shelfSmall from "@/public/shelfSmall.svg";
import shelfBig from "@/public/shelfBig.svg";
import {useForm} from "react-hook-form";
import ToastNotification from "@/src/components/form/notification/ToastNotification";
import SuccessModal from "@/src/components/form/modal/SuccessModal";

const Page = () => {
    const params = useParams()
    const id = Number(params.id)

    const {item, loading, error} = useItem(id)

    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState({});

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        reset,
    } = useForm()

    const onSubmit = async (data) => {
        try {
            setShowErrorModal(false)
            setErrorMessage('')

            // const object = await axios.post('/api/parcel', data)
            console.log(data)

            setShowSuccessModal(true);
            // setFormData(object.data);
        } catch (error: any) {
            if (error instanceof Error) {
                setShowErrorModal(true);
                setErrorMessage(error.message || 'Something went wrong!');
            } else {
                setShowErrorModal(true);
                setErrorMessage('Something went wrong!');
            }
        } finally {
            reset();
        }
    };


    return (
        <Container title={`Edycja przedmiotu ${id}`}>

            {item &&
                <form
                    className={'flex flex-col'}
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <p className={'text-gray-500'}>numer identyfikacyjny</p>
                    <input
                        {...register('name')}
                        className={'text-2xl'}
                        type="text"
                        value={item.name}
                    />
                    <br/>
                    <p className={'text-gray-500'}>opis</p>
                    <textarea
                        {...register('description')}
                    >
                        {item.description}
                    </textarea>
                    <br/>
                    <p className={'text-gray-500'}>typ</p>
                    <input
                        className={'text-2xl'}
                        disabled
                        type="text"
                        value={item.itemType.name}
                    />
                    <br/>
                    <hr/>
                    {item.attributeValue.map((attribute, index) => {

                        return (
                            <div key={index}>
                                <p className={'text-gray-500'}>{attribute.typeAttribute.name}</p>
                                <input
                                    className={'text-2xl'}
                                    type="text"
                                    value={attribute.value}
                                />
                                <hr/>
                            </div>
                        )
                    })}
                    <br/>

                    <p className={'text-gray-500'}>rodzaj szuflady</p>
                    {/* TODO when item is in the magazine, you cannot change the shelfSize... */}

                    <div className={'flex'}>
                        <label className="flex items-center">
                            <input
                                defaultChecked={item.shelfSize === 'small'}
                                {...register('shelfSize')}
                                type="radio"
                                value={'small'}
                            />
                            <span className="ml-2">
                                    <div className={'flex justify-center items-center flex-col'}>
                                    <Image
                                        className={'mb-3'} priority src={ shelfSmall }
                                        alt={'shelf svg'}/>
                                        mała
                                    </div>
                                </span>
                        </label>
                        <label className="flex items-center">
                            <input
                                {...register('shelfSize')}
                                defaultChecked={item.shelfSize === 'big'}
                                type="radio"
                                value={'big'}
                            />
                            <span className="ml-2">
                                    <div className={'flex justify-center items-center flex-col'}>
                                    <Image
                                        className={'mb-3'} priority src={ shelfBig }
                                        alt={'shelf svg'}/>
                                        duża
                                    </div>
                                </span>
                        </label>
                    </div>

                    {showErrorModal && <ToastNotification key={Date.now()} text={errorMessage} />}
                    {showSuccessModal && <SuccessModal isOpen={true} text={'Success!'} bigText={'Success!'} objectData={formData} />}

                    <br/>
                    <br/>
                    <SubmitButton pending={false} />

                </form>
            }
        </Container>
    )
}

export default Page