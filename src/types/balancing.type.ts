export type BalancingType = {
    response: BalancingDataType
}
export type BalancingDataType = {
    id: number,
    type: string,
    category: string,
    amount: number,
    date: string,
    comment: string
}