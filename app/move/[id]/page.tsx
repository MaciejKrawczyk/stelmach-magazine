'use client'

import React from "react";
import {Places} from "@/objects/Places";
import {useParams} from "next/navigation";
import SubmitButton from "@/components/submitButton";
import MoveItemForm from "@/components/MoveItemForm";

const page = () => {

    const params = useParams()
    const id = params.id

    return (<MoveItemForm id={id}/>)
}

export default page