import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";


export const useItems = () => {
    const [items, setItems] = useState<IDbResponseTypes[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchItems = async (): Promise<void> => {
        try {
            setLoading(true);  // Start by setting loading to true each time fetchItems is called.
            const response: AxiosResponse = await axios.get('/api/item');
            if (response && response.data) {
                setItems(response.data);
            }
        } catch (err: any) {
            setError(err.message || "Error fetching items");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);


    const refetch = () => {
        setError(null);
        fetchItems();
    };

    return { items, loading, error, refetch };
};
