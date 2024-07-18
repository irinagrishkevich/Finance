export type CategoriesIncomeType = {
    response:{
        id: number,
        title: string
        forEach(param: (incomeCategory) => void): void;
    }
}