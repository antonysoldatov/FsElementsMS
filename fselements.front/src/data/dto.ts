export interface ElementCategory {
    id: string,
    name: string
}

export interface ElementForm {
    id: string,
    name: string,
    image: string,
    elementCategoryId: string
}

export interface Element {
    id?: string,
    uniqueCode: string,
    name: string,
    priceWholesale: number,
    priceRetail: number,
    width: number,
    height: number,
    weight: number,
    elementFormId: string,
    categoryId: string,
    sellerId: string
}

export interface MakeOrder {
    elements: ElementMakeOrder[],
    sellerId: string,
    phoneNumber: string,
    address: string
}

export interface ElementMakeOrder {
    elementId: string,
    count: number,
    sellerId: string,
}

export interface Order {
    id: string,
    sellerId: string,
    elements: ElementOrder[],
    phoneNumber: string,
    address: string,
    createdAt: Date
}

export interface ElementOrder {
    elementId: string,
    count: number,
    uniqueCode: string,
    name: string
}