'use client'

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import loadingSVG from "@/public/Dual Ring-1.5s-191px.svg";
import {useItemTypes} from "@/src/components/hooks/useItemType";
import {Control, Controller, useFormContext} from "react-hook-form";

interface ItemTypeAttributesInputProps {
    title: string;
    description: string;
    note: string;
}

const ItemTypeAttributesInput: React.FC<ItemTypeAttributesInputProps> = ({
                                                                             title,
                                                                             description,
                                                                             note,
                                                                         }) => {

    const [typeAttributes, setTypeAttributes] = useState({});
    const [isLoadingTypes, setIsLoadingTypes] = useState(false);
    const [currentItemType, setCurrentItemType] = useState("")

    const [typeAttributesForm, setTypeAttributesForm] = useState({})

    const {itemTypes, loading: itemTypesLoading, error: itemTypesError} = useItemTypes()

    const {
        watch,
        setValue,
    } = useFormContext();


    const selectedItemType = watch("itemTypeId");

    useEffect(() => {
        const fetchTypeAttributes = async () => {
            setIsLoadingTypes(true);
            try {
                if (selectedItemType) {
                    const response = await axios.get('/api/typeattribute', {
                        params: {
                            itemtypeId: selectedItemType
                        }
                    });
                    setTypeAttributes(Object.values(response.data)); // assuming response.data is an object
                }
            } catch (error) {
                console.error("Error fetching type attributes", error);
            }
            setIsLoadingTypes(false);
        };
        fetchTypeAttributes();
    }, [selectedItemType]);

    return (
        <div className="w-full flex justify-between">
            <div className="w-1/3">
                <h2 className="text-lg mb-2">{title}</h2>
                <p className="text-zinc-500 font-light text-sm">{description}</p>
            </div>
            <div className="w-1/3 text-xs">
                <div className="flex flex-col">
                    <div className="flex justify-center items-center">
                        {itemTypesLoading ? (
                            <div className="flex justify-center items-center">
                                <Image priority alt={'loading...'} src={loadingSVG}/>
                            </div>
                        ) : null}
                        <Controller
                            name="itemTypeId"
                            render={({field}) => (
                                <select
                                    {...field}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setCurrentItemType(e.target.value);
                                    }}
                                    value={currentItemType} // This ensures the selected value is bound to the currentItemType state
                                    className="w-full border-gray-300 p-3 rounded-lg text-sm focus:border-gray-500 focus:shadow-lg transition duration-150 ease-in-out"
                                >
                                    <option value="" disabled>Wybierz typ przedmiotu</option>
                                    {itemTypes.map((type, index) => (
                                        <option key={index} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        />
                    </div>
                    <span className="pt-3 pl-1 mb-2 text-gray-500">{note}</span>
                    {Object.entries(typeAttributes).map(([key, attribute], index) => (
                        <div key={index} className="relative my-4">
                            <input
                                id={`input_${index}`}
                                className="border-2 w-full border-gray-300 rounded-lg p-3 text-sm focus:border-gray-500 focus:shadow-lg transition-all duration-150 ease-in-out appearance-none"
                                type="text"
                                defaultValue={""}
                                onChange={(e) => {
                                    const attributeIdNumber = Number(attribute.id);
                                    const updatedAttributes = { ...typeAttributesForm, [attributeIdNumber]: e.target.value };
                                    setTypeAttributesForm(updatedAttributes);
                                    setValue('attributes', updatedAttributes);
                                }}
                            />
                            <label
                                htmlFor={`input_${index}`}
                                className="absolute text-sm top-0 left-3 bg-white px-1 text-gray-500 transform origin-left scale-90 -translate-y-2 pointer-events-none transition-transform duration-300 ease-in-out"
                            >
                                {attribute.name}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ItemTypeAttributesInput;
