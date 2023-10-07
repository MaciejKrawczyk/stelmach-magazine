import { useEffect, useState } from "react";
import axios from "axios";

export const useShelfCategories = () => {
    const [shelfCategories, setShelfCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<null | string>(null);

    const fetchShelfCategories = async () => {
        try {
            const response = await axios.get('/api/shelf-category');
            if (response && response.data) {
                setShelfCategories(response.data);
            }
        } catch (err) {
            setError(err.message || "Error fetching shelf categories");  // Capture and set error message.
        } finally {
            setLoading(false); // Data processing is done, set loading to false.
        }
    };

    useEffect(() => {
        fetchShelfCategories();
    }, []);

    return { shelfCategories, loading, error };
}
