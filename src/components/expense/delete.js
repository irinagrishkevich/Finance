import {HttpUtils} from "../../utils/http-utils";
import {Expense} from "./expense";

export class DeleteExpense {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute

        this.deleteExpenseBtnElement = document.getElementById('deleteExpenseBtn')
        this.cancelDeleteExpenseBtnElement = document.getElementById('cancelDeleteExpenseBtn')

        this.deleteExpenseBtnElement.addEventListener('click', this.deleteExpense.bind(this))
        this.cancelDeleteExpenseBtnElement.addEventListener('click', this.cancelDeleteExpense.bind(this))


    }
    async deleteExpense() {
        const urlParams = new URLSearchParams(window.location.search)

        const id = urlParams.get('id')
        if (!id) {
            return this.openNewRoute('/')
        }
        const result = await HttpUtils.request('/categories/expense/' + id,  'DELETE' )
        if (result.redirect) {
            return this.openNewRoute(result.redirect)
        }
        if (result.error || !result.response || (result.response && result.response.error)) {
            console.log(result.response)
            return alert('Ошибка при удалении категории дохода')
        }
        return this.openNewRoute('/expense')
    }
     cancelDeleteExpense() {
        this.openNewRoute('/expense')
    }
}