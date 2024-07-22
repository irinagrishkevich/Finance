import {EditBaseBalancing} from "../services/edit-base-balancing";
import {CategoriesIncomeType} from "../../types/categories-income.type";
import {DefaultResponseType} from "../../types/default-response.type";
import {HttpUtils} from "../../utils/http-utils";

export class EditExpenseBalancing extends EditBaseBalancing {
    protected getCategoryUrl(): string {
        return '/categories/expense';
    }

    protected getCategoryType(): string {
        return 'expense';
    }

    protected getAlternateTypeValue(): string {
        return '1';
    }

    protected async showAlternateCategory(): Promise<void> {
        try {
            (this.categorySelectElement as HTMLSelectElement).innerHTML = '';
            const result: CategoriesIncomeType[] | DefaultResponseType = await HttpUtils.request('/categories/income');
            (result as CategoriesIncomeType[]).forEach((incomeCategory) => {
                const categoryElement = document.createElement('option');
                categoryElement.value = incomeCategory.id.toString();
                categoryElement.innerText = incomeCategory.title;
                if (this.categorySelectElement) {
                    this.categorySelectElement.appendChild(categoryElement);
                }
            });
            this.typeCategoryName = 'income';
        } catch (error) {
            console.error('Ошибка при загрузке категорий доходов:', error);
        }
    }
}