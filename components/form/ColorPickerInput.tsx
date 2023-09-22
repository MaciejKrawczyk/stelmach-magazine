import React, {FC, useState} from 'react';
import {HexColorPicker} from "react-colorful";

interface colorPickerInputProps {
    value: string;
    onChange: (e: any) => void;
    title: string,
    description: string,
    note: string
}

const ColorPickerInput: FC<colorPickerInputProps> = ({
        value,
        onChange,
        note,
        description,
        title
     }) => {

    const [color, setColor] = useState(value || '#FF33FF');  // set a default color if value is empty or undefined

    const name = 'color'

    const handleColorChange = newColor => {
        if (newColor) {
            setColor(newColor);
            const eventObj = {
                target: {
                    name,
                    value: newColor
                }
            };
            onChange(eventObj);
        }
    };

    return (
        <div className={'w-full flex justify-between'}>
            <div className={'w-2/5'}>
                <h2 className={'text-lg mb-2'}>{title}</h2>
                <p className={'text-zinc-500 font-light text-sm'}>{description}</p>
            </div>
            <div className={'w-1/3 text-xs text-red-600'}>
                <div className={'flex flex-col'}>
                    <HexColorPicker color={color} onChange={handleColorChange} />
                    <span className={'pt-3 pl-1'}>{note}</span>
                </div>
            </div>
        </div>
    );
}

export default ColorPickerInput;
