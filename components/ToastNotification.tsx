// ToastNotification.js
import React, { useState, useEffect } from 'react';

function ToastNotification({ shouldAppear, text }) {
    const [isVisible, setIsVisible] = useState(shouldAppear);

    useEffect(() => {
        setIsVisible(shouldAppear);
        if (shouldAppear) {
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 5000);
            return () => clearTimeout(timer); // Clear timeout if the component is unmounted
        }
    }, [shouldAppear]);

    const classes = isVisible
        ? "opacity-100 visible transition-opacity"
        : "opacity-0 invisible transition-opacity";

    return (
        <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-stone-800 text-white p-6 rounded-md flex items-center justify-between ${classes} duration-300`}>
            <span className="text-lg">{text}</span>
            <button className="bg-transparent border-none text-white ml-4 cursor-pointer" onClick={() => setIsVisible(false)}>Zamknij</button>
        </div>
    );
}

export default ToastNotification;
