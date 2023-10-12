'use client'

import Container from "@/src/components/Container";
import React, {useEffect, useState} from "react";
import {useItem} from "@/src/hooks/useItem";
import {useParams, useRouter} from "next/navigation";
import SubmitButton from "@/src/components/form/SubmitButton";
import Image from "next/image";
import shelfSmall from "@/public/shelfSmall.svg";
import shelfBig from "@/public/shelfBig.svg";
import {useForm} from "react-hook-form";
import ToastNotification from "@/src/components/form/notification/ToastNotification";
import SuccessModal from "@/src/components/form/modal/SuccessModal";
import axios from "axios";

const Page = () => {
    const params = useParams()
    const id = Number(params.id)

    const router = useRouter()
    
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
            setShowErrorModal(false);
            setErrorMessage('');
            
            // Convert attributeValue array to object
            const attributeValueObj = {};
            for (let key in data.attributeValue) {
                if (data.attributeValue[key] !== null && data.attributeValue[key] !== undefined) {
                    attributeValueObj[key] = data.attributeValue[key];
                }
            }
            data.attributeValue = attributeValueObj;
            
            
            console.log(data)
            const object = await axios.put(`/api/item/edit/${id}`, data)
            console.log(object)
            
            // setShowSuccessModal(true);
            router.push('/')
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
                                  {...register(`attributeValue.${attribute.id}`)}
                                  className={'text-2xl'}
                                  type="text"
                                  defaultValue={attribute.value}
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
                    {showSuccessModal && <SuccessModal isOpen={true} text={'Success!'} bigText={'Success!'} objectData={formData} onClose={() => setShowSuccessModal(false)} />}

                    <br/>
                    <br/>
                    <SubmitButton pending={false} />

                </form>
            }
        </Container>
    )
}

export default Page