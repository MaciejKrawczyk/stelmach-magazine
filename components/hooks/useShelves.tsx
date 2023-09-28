import { useEffect, useState } from "react";
import axios from "axios";

export const useShelves = () => {
    const [shelves, setShelves] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<null | string>(null);

    const fetchShelves = async () => {
        try {
            const response = await axios.get('/api/shelf');
            if (response && response.data) {
                setShelves(response.data);
            }
        } catch (err) {
            setError(err.message || "Error fetching shelf categories");  // Capture and set error message.
        } finally {
            setLoading(false); // Data processing is done, set loading to false.
        }
    };

    useEffect(() => {
        fetchShelves();
    }, []);

    return { shelves, loading, error };
}
