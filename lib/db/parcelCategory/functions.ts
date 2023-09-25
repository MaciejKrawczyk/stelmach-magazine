import axios from "axios";
import {ParcelCategory} from "@/types/zod/ParcelCategory";

export const createParcelCategory = async (payload: ParcelCategory) => {
    const object = await axios.post('/api/parcelCategory', payload)
    return object
}

