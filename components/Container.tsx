import React, { FC, ReactNode } from 'react';

interface ContainerProps {
    children: ReactNode;
}

const Container: FC<ContainerProps> = ({ children }) => {
    return (
        <div className={'flex justify-center'}>
            <main className="w-9/12 h-auto mb-28">
                {children}
            </main>
        </div>
    );
}

export default Container;
