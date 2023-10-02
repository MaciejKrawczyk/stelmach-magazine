import React, {FC, ForwardRefRenderFunction} from 'react'

interface NumberInputProps {
    id: string;
    title: string;
    description: string;
    note: string;
}

const NumberInput: ForwardRefRenderFunction<HTMLInputElement, NumberInputProps> = ({
        id,
        title,
        description,
        note,
        ...props},
        ref
) => {


    return (
        <div className={'w-full flex justify-between'}>
            <div className={'w-2/5'}>
                <h2 className={'text-lg mb-2'}>{title}</h2>
                <p className={'text-zinc-500 font-light text-sm'}>{description}</p>
            </div>
            <div className={'w-1/3 text-xs text-red-600'}>
                <div className={'flex flex-col'}>
                    <input
                        ref={ref}
                        {...props}
                        className="border-2 w-full border-gray-300 rounded-lg p-3 text-sm focus:border-gray-500 focus:shadow-lg transition duration-150 ease-in-out"
                        type="number"
                        id={id}
                    />
                    <span className={'pt-3 pl-1'}>{note}</span>
                </div>
            </div>
        </div>
    )
}

export default React.forwardRef(NumberInput);
