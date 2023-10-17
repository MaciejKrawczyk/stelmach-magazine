
import { useEffect, useState } from "react";

export const useItem = (id: number) => {
    const [item, setItem] = useState<IDbResponseItem>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<null | string>(null);

    const fetchItems = async () => {
        try {
            const response = await fetch(`/api/item/${id}`);
            if (response.ok) {
                const item = await response.json()
                setItem(item);
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Error fetching items");
            }
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    return { item, loading, error };
}