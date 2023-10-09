'use client'

import Container from "@/src/components/Container";
import React from "react";
import {useItem} from "@/src/components/hooks/useItem";
import {useParams} from "next/navigation";
import ItemTypeAttributesInput from "@/src/components/form/ItemTypeAttributesInput";
import SubmitButton from "@/src/components/form/SubmitButton";

const Page = () => {
    const params = useParams()
    const id = Number(params.id)

    const {item, loading, error} = useItem(id)


    return (
        <Container title={`Edycja przedmiotu ${id}`}>

            {item &&
                <form className={'flex flex-col'}>
                    <p className={'text-gray-500'}>numer identyfikacyjny</p>
                    <input
                        className={'text-2xl'}
                        disabled
                        type="text"
                        value={item.name}
                    />
                    <br/>
                    <p className={'text-gray-500'}>opis</p>
                    <textarea>{item.description}</textarea>
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
                    {item.attributeValue.map((attribute) => {

                        return (
                            <>
                                <p className={'text-gray-500'}>{attribute.typeAttribute.name}</p>
                                <input
                                    className={'text-2xl'}
                                    type="text"
                                    value={attribute.value}
                                />
                                <hr/>
                            </>
                        )
                    })}
                    <br/>
                    <br/>
                    <SubmitButton pending={false} />

                </form>
            }


        </Container>
    )
}

export default Page