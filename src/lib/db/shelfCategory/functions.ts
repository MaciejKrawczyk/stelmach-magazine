import axios from "axios";

export const createShelfCategory = async (payload) => {
    return await axios.post('/api/category', payload)
}

