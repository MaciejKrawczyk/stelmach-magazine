import React, {FC} from "react";
import {formatCommasToDots} from "@/utils/formatCommaToDots";


interface SelectInputProps {
    id: string;
    value: string;
    setValue: (value: string) => void;
    title: string;
    description: string;
    note: string;
    objectList: any[]
}

const SelectInput: FC<SelectInputProps> = ({ id, value, setValue, title, description, note, objectList }) => {

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = formatCommasToDots(e.target.value)
        setValue(newValue);
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

                        <select
                            className="w-full border-gray-300 p-3 rounded-lg text-sm focus:border-gray-500 focus:shadow-lg transition duration-150 ease-in-out"
                            name={id}
                            value={value}
                            onChange={handleValueChange}
                        >
                            <option value="" disabled>Wybierz firmę</option>
                            {objectList.map((object, index) => (
                                <option key={index} value={object.id}>
                                    {object.name}
                                </option>
                            ))}
                        </select>

                    </div>
                    <span className="pt-3 pl-1 mb-2 text-gray-500">{note}</span>
                </div>
            </div>
        </div>
    )
}

export default SelectInput
