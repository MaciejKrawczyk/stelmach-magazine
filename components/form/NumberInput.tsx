import React, { FC } from 'react'
import { formatCommasToDots } from "@/utils/formatCommaToDots";

/**
 * TextInput Component
 *
 * This component renders a text input with an associated title, description, and note.
 * It utilizes the id, value, setValue, placeholder, title, description, and note props.
 *
 * @param {string} id - The unique identifier for the input.
 * @param {string} value - The current value of the input.
 * @param {(value: string) => void} setValue - Callback function to update the input value.
 * @param {string} placeholder - Placeholder text for the input.
 * @param {string} title - Title displayed above the input.
 * @param {string} description - A brief description or instruction about the input.
 * @param {string} note - Additional notes or warnings displayed below the input.
 */
interface TextInputProps {
    id: string;
    value: string;
    setValue: (value: string) => void;
    title: string;
    description: string;
    note: string;
}

const TextInput: FC<TextInputProps> = ({ id, value, setValue, title, description, note }) => {

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = formatCommasToDots(e.target.value)
        setValue(newValue);
    };

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
                        type="number"
                        name={id}
                        value={value}
                        onChange={handleValueChange}
                    />
                    <span className={'pt-3 pl-1'}>{note}</span>
                </div>
            </div>
        </div>
    )
}

export default TextInput
