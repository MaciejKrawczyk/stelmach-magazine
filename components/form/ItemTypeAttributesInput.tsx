'use client'

import Image from "next/image";
import loadingSVG from "@/public/Dual Ring-1.5s-191px.svg";
import React, {FC, useEffect, useState} from "react";
import axios from "axios";



interface ItemTypeAttributesInputProps {
    id: string;
    title: string;
    description: string;
    note: string;
    formData: any;
    setFormData: any
}

const ItemTypeAttributesInput: FC<ItemTypeAttributesInputProps> = ({ id, title, description, note, formData, setFormData }) => {

    const [itemTypes, setItemTypes] = useState([]);
    const [typeAttributes, setTypeAttributes] = useState([]);

    const [isLoadingTypes, setIsLoadingTypes] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const itemTypesResponse = await axios.get('/api/itemtype');
                setItemTypes(itemTypesResponse.data);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchData();
    }, []);


    useEffect(() => {
        const fetchTypeAttributes = async () => {
            setIsLoadingTypes(true)
            try {
                if (formData.itemType) {  // Only fetch if itemType exists
                    const response = await axios.get('/api/typeattribute', {
                        params: {
                            itemtypeId: formData.itemType
                        }
                    });
                    setTypeAttributes(response.data);
                }
            } catch (error) {
                console.error("Error fetching type attributes", error);
            }
            setIsLoadingTypes(false)
        };
        fetchTypeAttributes();
    }, [formData.itemType]);


    const handleChange = (e) => {
        const { name, value } = e.target;

        const newValue = value.replace(/,/g, '.');

        setFormData({
            ...formData,
            [name]: newValue,
        });
    };

    const handleAttributesChange = (e) => {
        const { name, value } = e.target;

        const newValue = value.replace(/,/g, '.');

        // Update only the specific attribute value that was changed
        setFormData(prevState => ({
            ...prevState,
            typeAttributes: {
                ...prevState.typeAttributes,
                [name]: newValue
            }
        }));
    };

    return (
        <div className="w-full flex justify-between">
            <div className="w-1/3">
                <h2 className="text-lg mb-2">{title}</h2>
                <p className="text-zinc-500 font-light text-sm">
                    {description}
                </p>
            </div>
            <div className="w-1/3 text-xs">
                <div className="flex flex-col">
                    <div className="flex justify-center items-center">

                        {isLoadingTypes ? <div className="flex justify-center items-center">
                            <Image priority alt={'loading...'} src={loadingSVG}/>
                        </div> : <></>}

                        <select
                            className="w-full border-gray-300 p-3 rounded-lg text-sm focus:border-gray-500 focus:shadow-lg transition duration-150 ease-in-out"
                            name={id}
                            value={formData.itemType}
                            onChange={handleChange}
                        >
                            <option value="" disabled>Wybierz typ przedmiotu</option>
                            {itemTypes.map((type, index) => (
                                <option key={index} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>

                    </div>
                    <span className="pt-3 pl-1 mb-2 text-gray-500">{note}</span>

                    {typeAttributes.map((attribute, index) => (
                        <div key={index} className="relative my-4">
                            <input
                                id={`input_${index}`}
                                className="border-2 w-full border-gray-300 rounded-lg p-3 text-sm focus:border-gray-500 focus:shadow-lg transition-all duration-150 ease-in-out appearance-none"
                                type="text"
                                name={attribute.id}
                                onChange={handleAttributesChange}
                                value={formData.typeAttributes[attribute.id] || ''}
                            />
                            <label htmlFor={`input_${index}`}
                                   className="absolute text-sm top-0 left-3 bg-white px-1 text-gray-500 transform origin-left scale-90 -translate-y-2 pointer-events-none transition-transform duration-300 ease-in-out">
                                {attribute.name}
                            </label>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    )
}


export default ItemTypeAttributesInput

