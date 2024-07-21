import { CategoriesIncomeType } from "../../types/categories-income.type";
import {EditBaseBalancing} from "../services/edit-base-balancing";
import {DefaultResponseType} from "../../types/default-response.type";
import {HttpUtils} from "../../utils/http-utils";

export class EditIncomeBalancing extends EditBaseBalancing {
    protected getCategoryUrl(): string {
        return '/categories/income';
    }

    protected getCategoryType(): string {
        return 'income';
    }

    protected getAlternateTypeValue(): string {
        return '2';
    }

    protected async showAlternateCategory(): Promise<void> {
        try {
            (this.categorySelectElement as HTMLSelectElement).innerHTML = '';
            const result: CategoriesIncomeType[] | DefaultResponseType = await HttpUtils.request('/categories/expense');
            (result as CategoriesIncomeType[]).forEach((expenseCategory) => {
                const categoryElement = document.createElement('option');
                categoryElement.value = expenseCategory.id.toString();
                categoryElement.innerText = expenseCategory.title;
                if (this.categorySelectElement) {
                    this.categorySelectElement.appendChild(categoryElement);
                }
            });
            this.typeCategoryName = 'expense';
        } catch (error) {
            console.error('Ошибка при загрузке категорий расходов:', error);
        }
    }
}





