import axios from "axios";
import {Order} from "@/types/zod/Order";
import {generateRandomUUID} from "@/utils/generateRandomUUID";

export const createOrder = async (payload: Order) => {

    for (let i=0;i< Number(payload.quantity) ; i++) {
        // console.log(i)
        // console.log('weszlo')
        payload.name = `ORDER ${generateRandomUUID()}`
        await axios.post('/api/item', payload)
    }

}

