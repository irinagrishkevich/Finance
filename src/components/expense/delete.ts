import {HttpUtils} from "../../utils/http-utils";
import {DefaultResponseType} from "../../types/default-response.type";
import {CategoriesIncomeType} from "../../types/categories-income.type";

export class DeleteExpense {
    readonly openNewRoute: (url: string) => void;
    private deleteExpenseBtnElement: HTMLInputElement | null;
    private cancelDeleteExpenseBtnElement: HTMLInputElement | null;
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute

        this.deleteExpenseBtnElement = document.getElementById('deleteExpenseBtn') as HTMLInputElement;
        this.cancelDeleteExpenseBtnElement = document.getElementById('cancelDeleteExpenseBtn') as HTMLInputElement;

        this.deleteExpenseBtnElement.addEventListener('click', this.deleteExpense.bind(this))
        this.cancelDeleteExpenseBtnElement.addEventListener('click', this.cancelDeleteExpense.bind(this))


    }
    private async deleteExpense(): Promise<void> {
        const urlParams: URLSearchParams = new URLSearchParams(window.location.search)

        const id: string | null = urlParams.get('id')
        if (!id) {
            return this.openNewRoute('/')
        }
        const result: DefaultResponseType | CategoriesIncomeType = await HttpUtils.request('/categories/expense/' + id,  'DELETE' )
        if ((result as DefaultResponseType).redirect) {
            return this.openNewRoute((result as DefaultResponseType).redirect)
        }
        if ((result as DefaultResponseType).error || !((result as CategoriesIncomeType).response || (result as CategoriesIncomeType).response)) {
            console.log("Ошибка при удалении категории дохода")
            return
        }
        return this.openNewRoute('/expense')
    }
     private async cancelDeleteExpense(): Promise<void> {
        await this.openNewRoute('/expense')
    }
}