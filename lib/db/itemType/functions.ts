import axios from "axios";

export const createItemType = async (payload) => {
    return await axios.post('/api/itemtype', payload)
}

