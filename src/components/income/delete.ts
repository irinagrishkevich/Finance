import {HttpUtils} from "../../utils/http-utils";
import {DefaultResponseType} from "../../types/default-response.type";
import {CategoriesIncomeType} from "../../types/categories-income.type";
import {OpenNewRouteFunction} from "../../types/open-new-route.type";

export class DeleteIncome {
readonly openNewRoute: OpenNewRouteFunction;
    private deleteIncomeBtnElement: HTMLInputElement | null;
    private cancelDeleteIncomeBtnElement: HTMLInputElement | null;
    constructor(openNewRoute: OpenNewRouteFunction) {
        this.openNewRoute = openNewRoute

        this.deleteIncomeBtnElement = document.getElementById('deleteIncomeBtn') as HTMLInputElement;
        this.cancelDeleteIncomeBtnElement = document.getElementById('cancelDeleteIncomeBtn') as HTMLInputElement;

        this.deleteIncomeBtnElement.addEventListener('click', this.deleteIncome.bind(this))
        this.cancelDeleteIncomeBtnElement.addEventListener('click', this.cancelDeleteIncome.bind(this))


    }
    private async deleteIncome(): Promise<void> {
        const urlParams: URLSearchParams = new URLSearchParams(window.location.search)

        const id: string | null = urlParams.get('id')
        if (!id) {
            return this.openNewRoute('/')
        }
        const result: CategoriesIncomeType | DefaultResponseType = await HttpUtils.request('/categories/income/' + id,  'DELETE' )
        if ((result as DefaultResponseType).redirect) {
            return this.openNewRoute('/login')
        }
        if ((result as DefaultResponseType).error || !(result as CategoriesIncomeType)) {
            console.log("Ошибка при удалении категории дохода")
            return
        }
        return this.openNewRoute('/income')
    }
     private async cancelDeleteIncome(): Promise<void> {
        await this.openNewRoute('/income')
    }
}