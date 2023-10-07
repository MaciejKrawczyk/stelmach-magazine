'use client'

import React from "react";
import {Places} from "@/src/objects/Places";
import {useParams} from "next/navigation";
import SubmitButton from "@/src/components/submitButton";
import MoveItemForm from "@/src/components/MoveItemForm";

const page = () => {

    const params = useParams()
    const id = params.id

    return (<MoveItemForm id={id}/>)
}

export default page