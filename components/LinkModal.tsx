'use client'

import React from 'react';
import {useRouter} from "next/navigation";

const LinkModal = ({ children }) => {

    const router = useRouter()

    return (
        <div className="fixed z-50 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
                <div className="fixed inset-0 transition-opacity" onClick={() => router.back()}>
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full sm:w-3/4 lg:w-1/2">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default LinkModal;
