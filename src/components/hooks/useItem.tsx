'use client'

import { useEffect, useState } from "react";
import axios from "axios";
import {Item} from "@prisma/client";

export const useItem = (id: number) => {
    const [item, setItem] = useState<Item>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<null | string>(null);

    const fetchItems = async () => {
        try {
            const response = await axios.get(`/api/item/${id}`);
            if (response && response.data) {
                setItem(response.data);
            }
        } catch (err) {
            setError(err.message || "Error fetching items");  // Capture and set error message.
        } finally {
            setLoading(false); // Data processing is done, set loading to false.
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    return { item, loading, error };
}