import { CreateBaseBalacing} from "../services/create-base-balancing";

export class CreateIncomeBalancing extends CreateBaseBalacing{
    protected getTypeCategoryName(): string {
        return "income";
    }
    protected getCategoryUrl(): string {
        return "/categories/income";
    }
}