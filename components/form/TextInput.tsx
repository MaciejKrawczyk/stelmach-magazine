import React, { FC } from 'react'
import {formatCommasToDots} from "@/utils/formatCommaToDots";


/**
 * TextInput component.
 *
 * This component renders a text input with accompanying title, description, and note.
 * value and setValue are useState variables!
 *
 * @param {string} id - The unique identifier for the input.
 * @param {string} value - The current value of the input.
 * @param {(value: string) => void} setValue - Callback to update the value of the input.
 * @param {string} placeholder - Placeholder text for the input.
 * @param {string} title - Title displayed above the input.
 * @param {string} description - A brief description or instruction about the input.
 * @param {string} note - Additional notes or warnings displayed below the input.
 */
interface TextInputProps {
    id: string;
    formData: string;
    setFormData: (value: string) => void;
    placeholder: string;
    title: string;
    description: string;
    note: string;
}

const TextInput: FC<TextInputProps> = ({ id, formData, setFormData, placeholder, title, description, note }) => {

    const handleChange = (e) => {
        const { name } = e.target;
        let newValue = formatCommasToDots(e.target.value)
        setFormData({
            ...formData,
            [name]: newValue,
        });
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
                        placeholder={placeholder}
                        type="text"
                        id={id}
                        value={formData}
                        name={id}
                        onChange={handleChange}
                    />
                    <span className={'pt-3 pl-1'}>{note}</span>
                </div>
            </div>
        </div>
    )
}

export default TextInput