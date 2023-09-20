import React, { FC } from 'react'
import {HexColorPicker} from "react-colorful";

/**
 * ColorPickerInput component.
 *
 * This component renders a hex color picker with accompanying title, description, and note.
 * color and setColor are useState variables!
 *
 * @param {string} color - The current color value.
 * @param {(color: string) => void} setColor - Callback to update the color value.
 * @param {string} title - Title displayed above the color picker.
 * @param {string} description - A brief description or instruction about the color picker.
 * @param {string} note - Additional notes or warnings displayed below the color picker.
 */
interface colorPickerInputProps {
    color: string;
    setColor: (color: string) => void;
    title: string,
    description: string,
    note: string
}

const ColorPickerInput: FC<colorPickerInputProps> = ({color, setColor, note, description, title}) => {

    return <div className={'w-full flex justify-between'}>
        <div className={'w-2/5'}>
            <h2 className={'text-lg mb-2'}>{title}</h2>
            <p className={'text-zinc-500 font-light text-sm'}>{description}</p>
        </div>
        <div className={'w-1/3 text-xs text-red-600'}>
            <div className={'flex flex-col'}>
                <HexColorPicker color={color} onChange={setColor} />
                <span className={'pt-3 pl-1'}>{note}</span>
            </div>
        </div>
    </div>
}

export default ColorPickerInput