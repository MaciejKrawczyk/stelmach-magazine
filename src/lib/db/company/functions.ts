import {Company} from "@/src/types/zod/Company";
import axios from "axios";

export const createCompany = async (payload: Company) => {
    const object = await axios.post('/api/company', payload)
    return object
}

