import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios"; // AxiosResponse imported for better typing

axios.defaults.headers = {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0',
}

export const useShelfCategories = () => {
    const [shelfCategories, setShelfCategories] = useState<IDbResponseShelfCategory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchShelfCategories = async (): Promise<void> => {
        try {
            setLoading(true);  // Start by setting loading to true each time fetchShelfCategories is called.
            const response: AxiosResponse = await axios.get('/api/shelf-category');
            if (response && response.data) {
                setShelfCategories(response.data);
            }
        } catch (err: any) {
            setError(err.message || "Error fetching shelf categories");  // Capture and set error message.
        } finally {
            setLoading(false); // Data processing is done, set loading to false.
        }
    };

    useEffect(() => {
        fetchShelfCategories();
    }, []);

    const refetch = () => {
        setError(null); // Reset any previous errors
        fetchShelfCategories();
    };

    return { shelfCategories, loading, error, refetch }; // Added refetch to the returned object
}
