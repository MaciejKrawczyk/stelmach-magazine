interface IDbResponseItem {
    id: number,
    name: string
    description: string
    placeId: number
    shelfId: number | null
    shelfSize: number
    itemTypeId: number
    companyId: number
    isDeleted: boolean
    isOrder: boolean
    orderCategoryId: number | null
    parcelId: number | null
    parcel: IDbResponseParcel
    attributeValue: IDbResponseAttributeValue[]
    company: IDbResponseCompany
    itemType: IDbResponseItemType
    status: IDbResponseStatus[]
    shelf: IDbResponseShelf | null
    orderCategory: IDbResponseOrderCategory | null
}

interface IDbResponseTypeAttribute {
    id: number
    name: string
    itemtypeId: number
}

interface IDbResponseAttributeValue {
    id: number
    value: string
    itemId: number
    typeAttributeId: number
    typeAttribute: IDbResponseTypeAttribute
}

interface IDbResponseCompany {
    id: number
    name: string
    notes: string
}

interface IDbResponseItemType {
    id: number
    name: string
}

interface IDbResponseStatus {
    id: number
    itemId: number
    name: string
    description: string
    createdAt: Date
    updatedAt: Date
}

interface IDbResponseShelfCategory {
    id: number
    name: string
    color: string
    notes: string
}

interface IDbResponseShelf {
    id: number
    name: string
    size: string
    shelfCategoryId: number
    shelfCategory: IDbResponseShelfCategory
    item: IDbResponseItem[]
}

interface IDbResponseOrderCategory {
    id: number
    name: string
    description: string
    color: string
}

interface IDbResponseParcel {
    id: number
    name: string
    description: string
    color: string
    companyId: number
    isSent: boolean
    company: IDbResponseCompany
}