import {CreateBaseBalacing} from "../services/create-base-balancing";

export class  CreateExpenseBalancing extends CreateBaseBalacing{
protected getTypeCategoryName(): string {
        return "expense";
    }
protected getCategoryUrl(): string {
        return "/categories/expense";
    }
}