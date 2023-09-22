'use client'

// useFormStatus.js

import { useState } from 'react';

const useFormStatus = () => {
    const [pending, setPending] = useState(false);

    const startSubmit = () => {
        setPending(true);
    };

    const finishSubmit = () => {
        setPending(false);
    };

    return {
        pending,
        startSubmit,
        finishSubmit
    };
};

export default useFormStatus;
