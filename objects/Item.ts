import {IItem} from "@/types/zod/Item";
import axios from "axios";

export class Item {
    private readonly name: string;
    private readonly description: string;
    private readonly placeId: number;
    private readonly shelfId: number | null;
    private readonly itemTypeId: number;
    private readonly companyId: number;
    private readonly orderCategoryId: number;
    private readonly parcelId: number;
    private readonly shelfSize: string;
    private readonly isOrder: boolean;
    private readonly isDeleted: boolean;
    private readonly props: IItem

    constructor(props: IItem) {

        // Default values
        const {
            isDeleted = false,
            isOrder = false,
            placeId = 1,
            shelfId = null,
            parcelId = null,
            ...restProps
        } = props;

        this.name = restProps.name;
        this.description = restProps.description;
        this.placeId = restProps.placeId;
        this.shelfId = restProps.shelfId;
        this.itemTypeId = restProps.itemTypeId;
        this.companyId = restProps.companyId;
        this.orderCategoryId = restProps.orderCategoryId;
        this.shelfSize = restProps.shelfSize;
        this.parcelId = restProps.parcelId;
        this.isDeleted = isDeleted;
        this.isOrder = isOrder;

        this.props = {
            ...restProps,
            isDeleted: this.isDeleted,
            isOrder: this.isOrder,
            placeId: this.placeId,
            shelfId: this.shelfId,
            parcelId: this.parcelId
        };
    }

    async create() {
        const object = await axios.post('/api/item', this.props);
    }

    move() {

    }

    edit() {

    }
}
