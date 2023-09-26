import { useEffect, useState } from "react";
import axios from "axios";

export const useCompanies = () => {
    const [companies, setCompanies] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<null | string>(null);

    const fetchCompanies = async () => {
        try {
            const response = await axios.get('/api/company');
            if (response && response.data) {
                setCompanies(response.data);
            }
        } catch (err) {
            setError(err.message || "Error fetching companies");  // Capture and set error message.
        } finally {
            setLoading(false); // Data processing is done, set loading to false.
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    return { companies, loading, error };
}
