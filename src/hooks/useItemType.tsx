import { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.headers = {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0',
}

export const useItemTypes = () => {
    const [itemTypes, setItemTypes] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<null | string>(null);

    const fetchItemTypes = async () => {
        try {
            const response = await axios.get('/api/item-type');
            if (response && response.data) {
                setItemTypes(response.data);
            }
        } catch (err) {
            setError(err.message || "Error fetching items");  // Capture and set error message.
        } finally {
            setLoading(false); // Data processing is done, set loading to false.
        }
    };

    useEffect(() => {
        fetchItemTypes();
    }, []);

    return { itemTypes, loading, error };
}