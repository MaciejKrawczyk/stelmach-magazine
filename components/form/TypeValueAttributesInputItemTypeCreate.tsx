import React, { FC, ChangeEvent } from 'react'
import {formatCommasToDots} from "@/utils/formatCommaToDots";

interface InputListElement {
    value: string;
    disabled: boolean;
}

interface TypeValueAttributesInputItemTypeCreateProps {
    title: string;
    description: string;
    typeAttributePlaceholder: string;
    note: string;
    setInputList: (value: InputListElement[]) => void;
    inputList: InputListElement[];
}

const TypeValueAttributesInputItemTypeCreate: FC<TypeValueAttributesInputItemTypeCreateProps> = ({
     title,
     description,
     typeAttributePlaceholder,
     note,
     setInputList,
     inputList
     }) => {

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>, index: number): void => {
        const { value } = e.target;
        formatCommasToDots(value)
        const newList = [...inputList];
        newList[index] = { value, disabled: false };
        setInputList(newList);
    };

    const handleAddInput = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const list = inputList.map(field => ({ ...field, disabled: true }));
        list.unshift({ value: "", disabled: false });
        setInputList(list);
    };

    const handleRemoveInput = (index: number, e: React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        const newList = [...inputList];
        newList.splice(index, 1);
        setInputList(newList);
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
                <div className="flex flex-col w-full">
                    <div className="flex justify-center items-center w-full flex-col">
                        <div className={'flex w-full'}>
                            <input
                                placeholder={typeAttributePlaceholder}
                                className="my-2 border-2 w-full border-gray-300 rounded-lg p-3 text-sm focus:border-gray-500 focus:shadow-lg transition duration-150 ease-in-out"
                                type="text"
                                value={inputList[0]?.value}
                                disabled={inputList[0]?.disabled}
                                onChange={(e) => handleInputChange(e, 0)}
                            />
                            <button
                                className="mx-3 my-2 w-12 h-auto bg-amber-600 cursor-pointer text-white flex justify-center items-center rounded-3xl"
                                onClick={(e) => handleAddInput(e)} disabled={!inputList[0]?.value}
                            >+</button>
                        </div>
                        {inputList.slice(1).map((inputField, index) => (
                            <div className={'flex w-full'} key={index + 1}>
                                <input
                                    className="my-2 border-2 w-full border-gray-300 rounded-lg p-3 text-sm focus:border-gray-500 focus:shadow-lg transition duration-150 ease-in-out"
                                    type="text"
                                    value={inputField.value}
                                    disabled={inputField.disabled}
                                    onChange={(e) => handleInputChange(e, index + 1)}
                                />
                                {inputList.length > 1 && (
                                    <button
                                        className="mx-3 my-2 w-12 h-auto bg-red-600 cursor-pointer text-white flex justify-center items-center rounded-3xl"
                                        onClick={(e) => handleRemoveInput(index + 1, e)}
                                    >-</button>
                                )}
                            </div>
                        ))}
                    </div>
                    <span className="pt-3 pl-1 mb-2 text-gray-500">{note}</span>
                </div>
            </div>
        </div>
    )
}

export default TypeValueAttributesInputItemTypeCreate