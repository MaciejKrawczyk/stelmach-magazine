import { useEffect, useState } from "react";
import axios from "axios";

export const useParcelCategories = () => {
    const [parcelCategories, setParcelCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<null | string>(null);

    const fetchParcelCategories = async () => {
        try {
            const response = await axios.get('/api/parcel-category');
            if (response && response.data) {
                setParcelCategories(response.data);
            }
        } catch (err) {
            setError(err.message || "Error fetching parcel categories");  // Capture and set error message.
        } finally {
            setLoading(false); // Data processing is done, set loading to false.
        }
    };

    useEffect(() => {
        fetchParcelCategories();
    }, []);

    return { parcelCategories, loading, error };
}
