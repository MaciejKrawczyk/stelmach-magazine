import React, { FC } from 'react';
import { HexColorPicker } from "react-colorful";
import { Controller, Control } from "react-hook-form";

interface ColorPickerInputProps {
    name: string;
    control: Control;
    defaultValue?: string;
    title: string;
    description: string;
    note: string;
}

const ColorPickerInput: FC<ColorPickerInputProps> = ({
                                                         name,
                                                         control,
                                                         defaultValue = "#FF33FF",
                                                         title,
                                                         description,
                                                         note
                                                     }) => {
    return (
        <div className={'w-full flex justify-between'}>
            <div className={'w-2/5'}>
                <h2 className={'text-lg mb-2'}>{title}</h2>
                <p className={'text-zinc-500 font-light text-sm'}>{description}</p>
            </div>
            <div className={'w-1/3 text-xs text-red-600'}>
                <div className={'flex flex-col'}>
                    <Controller
                        name={name}
                        control={control}
                        defaultValue={defaultValue}
                        render={({ field: { onChange, value } }) => (
                            <HexColorPicker
                                color={value}
                                onChange={onChange}
                            />
                        )}
                    />
                    <span className={'pt-3 pl-1'}>{note}</span>
                </div>
            </div>
        </div>
    );
}

export default ColorPickerInput;
