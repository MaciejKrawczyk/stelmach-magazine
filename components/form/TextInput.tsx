import React, { FC } from 'react'
import {formatCommasToDots} from "@/utils/formatCommaToDots";


interface TextInputProps {
    id: string;
    value: string;
    placeholder: string;
    title: string;
    description: string;
    note: string;
    onChange: any
}

const TextInput: FC<TextInputProps> = ({
    id,
    placeholder,
    title,
    description,
    note ,
    value,
    onChange
}) => {

    return (
        <div className={'w-full flex justify-between'}>
            <div className={'w-2/5'}>
                <h2 className={'text-lg mb-2'}>{title}</h2>
                <p className={'text-zinc-500 font-light text-sm'}>{description}</p>
            </div>
            <div className={'w-1/3 text-xs text-red-600'}>
                <div className={'flex flex-col'}>
                    <input
                        className="border-2 w-full border-gray-300 rounded-lg p-3 text-sm focus:border-gray-500 focus:shadow-lg transition duration-150 ease-in-out"
                        placeholder={placeholder}
                        type="text"
                        id={id}
                        value={value}
                        name={id}
                        onChange={onChange}
                    />
                    <span className={'pt-3 pl-1'}>{note}</span>
                </div>
            </div>
        </div>
    )
}

export default TextInput