'use client'

import { useEffect, useState } from "react";
import axios from "axios";


export const useItem = (id: number) => {
    const [item, setItem] = useState<IDbResponseItem>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<null | string>(null);

    const fetchItems = async () => {
        try {
            const response = await axios.get(`/api/item/${id}`);
            if (response && response.data) {
                setItem(response.data);
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Error fetching items");
            }
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    return { item, loading, error };
}