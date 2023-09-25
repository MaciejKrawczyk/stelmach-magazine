import axios from "axios";
import {Item} from "@/types/zod/Item";

export const createItem = async (payload: Item) => {
    return await axios.post('/api/item', payload)
}

