import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios"; // AxiosResponse imported for better typing


export const useShelves = () => {
    const [shelves, setShelves] = useState<IDbResponseShelf[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchShelves = async (): Promise<void> => {
        try {
            setLoading(true);  // Start by setting loading to true each time fetchShelves is called.
            // const response: AxiosResponse = await axios.get('/api/shelf');
            const response = await fetch('/api/shelf', {
                method: "get",
                cache: "no-cache",
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            if (response.ok) {
                const shelves = await response.json()
                setShelves(shelves);
            }
        } catch (err: any) {
            setError(err.message || "Error fetching shelf categories");  // Capture and set error message.
        } finally {
            setLoading(false); // Data processing is done, set loading to false.
        }
    };

    useEffect(() => {
        fetchShelves();
    }, []);

    const refetch = () => {
        setError(null); // Reset any previous errors
        fetchShelves();
    };

    return { shelves, loading, error, refetch }; // Added refetch to the returned object
}
