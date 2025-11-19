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