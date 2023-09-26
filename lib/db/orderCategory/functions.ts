import axios from "axios";
import {OrderCategory} from "@/types/zod/OrderCategory";

export const createOrderCategory = async (payload: OrderCategory) => {
    return await axios.post('/api/orderCategory', payload)
}

