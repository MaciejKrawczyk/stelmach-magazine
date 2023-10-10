'use client'

import React from "react";
import {useParams} from "next/navigation";
import MoveItemForm from "@/src/components/MoveItemForm";

const Page = () => {

    const params = useParams()
    const id = Number(params.id)

    return (<MoveItemForm id={id}/>)
}

export default Page