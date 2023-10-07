import React, { FC, ReactNode } from 'react';

interface ContainerProps {
    children: ReactNode;
    title: string
}

const Container: FC<ContainerProps> = ({title,  children }) => {
    return (
        <div className={'flex justify-center'}>
            <main className="w-9/12 h-auto mb-28">
                <h1 className={'font-semibold text-3xl my-10 mx-auto '}>{title}</h1>
                {children}
            </main>
        </div>
    );
}

export default Container;
