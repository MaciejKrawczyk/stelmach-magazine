import axios from "axios";
import {Parcel} from "@/src/types/zod/Parcel";

export const createParcelCategory = async (payload: Parcel) => {
    const object = await axios.post('/api/parcelCategory', payload)
    return object
}

