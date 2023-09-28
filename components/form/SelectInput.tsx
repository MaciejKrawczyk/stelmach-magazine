import React, { FC, forwardRef } from "react";
import { Controller, Control } from "react-hook-form";

interface SelectInputProps {
    id: string;
    title: string;
    description: string;
    note: string;
    objectList: any[];
    disabledOptions?: number[];
    enabledOptions?: number[];
    control: Control;
}

const SelectInput: FC<SelectInputProps> = ({
                                               id,
                                               title,
                                               description,
                                               note,
                                               objectList,
                                               disabledOptions,
                                               enabledOptions,
                                               control,
                                               ...props
                                           }) => {

    return (
        <div className="w-full flex justify-between">
            <div className="w-1/3">
                <h2 className="text-lg mb-2">{title}</h2>
                <p className="text-zinc-500 font-light text-sm">{description}</p>
            </div>
            <div className="w-1/3 text-xs">
                <div className="flex flex-col">
                    <div className="flex justify-center items-center">
                        <Controller
                            name={id}
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <select
                                    {...field}
                                    {...props}
                                    id={id}
                                    className="w-full border-gray-300 p-3 rounded-lg text-sm focus:border-gray-500 focus:shadow-lg transition duration-150 ease-in-out"
                                    onChange={(e) => {
                                        e.persist();
                                        field.onChange(Number(e.target.value));
                                    }}
                                >
                                    <option value="" disabled={true}>
                                        Wybierz opcję
                                    </option>
                                    {objectList.map((object, index) => {
                                        const isDisabled =
                                            (disabledOptions && disabledOptions.includes(object.id)) ||
                                            (enabledOptions && !enabledOptions.includes(object.id));

                                        return (
                                            <option key={index} value={object.id} disabled={isDisabled}>
                                                {object.name}
                                            </option>
                                        );
                                    })}
                                </select>
                            )}
                        />

                    </div>
                    <span className="pt-3 pl-1 mb-2 text-gray-500">{note}</span>
                </div>
            </div>
        </div>
    );
};

export default SelectInput;