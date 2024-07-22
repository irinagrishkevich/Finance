import {HttpUtils} from "../../utils/http-utils";
import {DefaultResponseType} from "../../types/default-response.type";
import {CategoriesIncomeType} from "../../types/categories-income.type";
import {OpenNewRouteFunction} from "../../types/open-new-route.type";

export class DeleteExpense {
    readonly openNewRoute: OpenNewRouteFunction;
    private deleteExpenseBtnElement: HTMLInputElement | null;
    private cancelDeleteExpenseBtnElement: HTMLInputElement | null;
    constructor(openNewRoute:OpenNewRouteFunction) {
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
            return this.openNewRoute('/login')
        }
        if ((result as DefaultResponseType).error || !(result as CategoriesIncomeType)) {
            console.log("Ошибка при удалении категории дохода")
            return
        }
        return this.openNewRoute('/expense')
    }
     private async cancelDeleteExpense(): Promise<void> {
        await this.openNewRoute('/expense')
    }
}