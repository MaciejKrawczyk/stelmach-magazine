import { useEffect, useState } from "react";
import axios from "axios";

export const useOrderCategories = () => {
    const [orderCategories, setOrderCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<null | string>(null);

    const fetchOrderCategories = async () => {
        try {
            const response = await axios.get('/api/order-category');
            if (response && response.data) {
                setOrderCategories(response.data);
            }
        } catch (err) {
            setError(err.message || "Error fetching order categories");  // Capture and set error message.
        } finally {
            setLoading(false); // Data processing is done, set loading to false.
        }
    };

    useEffect(() => {
        fetchOrderCategories();
    }, []);

    return { orderCategories, loading, error };
}