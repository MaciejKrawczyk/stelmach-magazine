import axios from "axios";
import {Item} from "@/src/types/zod/Item";

export const createItem = async (payload: Item) => {
    return await axios.post('/api/item', payload)
}

