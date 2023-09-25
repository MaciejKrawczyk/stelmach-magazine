import axios from "axios";
import {Order} from "@/types/zod/Order";

export const createOrder = async (payload: Order) => {
    return await axios.post('/api/order', payload)
}

