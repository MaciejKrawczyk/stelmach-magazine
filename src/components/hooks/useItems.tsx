import { useEffect, useState } from "react";
import axios from "axios";

export const useItems = () => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<null | string>(null);

    const fetchItems = async () => {
        try {
            const response = await axios.get('/api/item');
            if (response && response.data) {
                setItems(response.data);
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

    return { items, loading, error };
}