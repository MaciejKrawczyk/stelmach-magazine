import { useEffect, useState } from "react";
import axios from "axios";


export const useItemTypes = () => {
    const [itemTypes, setItemTypes] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<null | string>(null);

    const fetchItemTypes = async () => {
        try {
            const response = await fetch('/api/item-type', {
                cache: "no-cache"
            });
            if (response.ok) {
                const itemTypes = await response.json()
                setItemTypes(itemTypes);
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