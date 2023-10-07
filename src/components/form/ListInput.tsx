import React, { useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';

interface ListInputProps {
    placeholder: string;
    title: string;
    description: string;
    note: string;
    name: string;
    onItemsChange?: (items: string[]) => void;
}

const ListInput: React.FC<ListInputProps> = ({
                                                 placeholder,
                                                 title,
                                                 description,
                                                 note,
                                                 name,
                                                 onItemsChange,
                                                 ...props
                                             }) => {
    const { control, setValue, getValues, register, unregister } = useForm();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        register(name);
        return () => {
            unregister(name);
        };
    }, [register, unregister, name]);


    const addHandler = () => {
        const inputValue = inputRef.current?.value || "";
        if (inputValue.trim() !== '') {
            const currentItems = getValues(name) || [];
            setValue(name, [...currentItems, inputValue]);

            // Inform parent component
            onItemsChange && onItemsChange([...currentItems, inputValue]);

            // Clear the input field
            if (inputRef.current) {
                inputRef.current.value = '';
            }
        }
    }

    const deleteHandler = (index: number) => {
        const currentItems = getValues(name) || [];
        const updatedItems = currentItems.filter((_, i) => i !== index);
        setValue(name, updatedItems);
        onItemsChange && onItemsChange(updatedItems);
    }

    const inputStyles = "border-2 w-full border-gray-300 rounded-lg p-3 text-sm focus:border-gray-500 focus:shadow-lg transition duration-150 ease-in-out";

    return (
        <div className="w-full flex justify-between">
            <div className="w-2/5">
                <h2 className="text-lg mb-2">{title}</h2>
                <p className="text-zinc-500 font-light text-sm">{description}</p>
            </div>
            <div className="w-1/3 text-xs text-red-600">
                <div className="flex flex-col">
                    <div className="flex">
                        <input
                            {...props}
                            ref={inputRef}
                            className={inputStyles}
                            placeholder={placeholder}
                            type="text"
                        />
                        <div
                            onClick={addHandler}
                            className="mx-3 my-2 w-12 h-auto cursor-pointer text-white flex justify-center items-center rounded-3xl bg-amber-600"
                        >
                            +
                        </div>
                    </div>
                    <span className="pt-3 pl-1">{note}</span>
                    <Controller
                        name={name}
                        control={control}
                        render={({ field: { value = [] } }) => (  // Default the value to an empty array
                            value.map((item: string, index: number) => (
                                <div className="flex items-center" key={index}>
                                    <input disabled className={`${inputStyles} my-2`} type="text" value={item} />
                                    <div
                                        onClick={() => deleteHandler(index)}
                                        className="mx-3 my-2 w-12 h-auto cursor-pointer text-white flex justify-center items-center rounded-3xl bg-red-600"
                                    >
                                        -
                                    </div>
                                </div>
                            ))
                        )}
                    />

                </div>
            </div>
        </div>
    );
}

export default ListInput;
