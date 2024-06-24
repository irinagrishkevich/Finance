import {HttpUtils} from "../../utils/http-utils";
import {Expense} from "./expense";

export class ExpenseEdit  {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute

        const urlParams = new URLSearchParams(window.location.search)
        const id = urlParams.get('id')
        if (!id) {
            return this.openNewRoute('/')
        }

        this.saveExpense = document.getElementById('saveExpense')
        this.cancelExpense = document.getElementById('cancelExpense')
        this.nameExpense = document.getElementById('nameExpense')


        this.saveExpense.addEventListener('click', this.saveExpenseClick.bind(this))
        this.cancelExpense.addEventListener('click', this.cancelExpenseClick.bind(this))

        this.getExpense(id).then()
    }

    async getExpense(id) {
        const result = await HttpUtils.request('/categories/expense/'+ id )
        if (result.redirect) {
            return this.openNewRoute(result.redirect)
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            console.log(result.response.message)
            return alert('Ошибка при запросе категории дохода')
        }
        this.ExpenseCategoryData = result.response
        this.nameExpense.value = result.response.title
    }
    async saveExpenseClick() {
        let changedData = ''
        if (this.nameExpense.value && this.nameExpense.value !== this.ExpenseCategoryData.title) {
            changedData = this.nameExpense.value
        }
        if (changedData){
            const result = await HttpUtils.request('/categories/expense/' + this.ExpenseCategoryData.id, 'PUT',true, {
                title: changedData
            })
            if (result.redirect) {
                return this.openNewRoute(result.redirect)
            }

            if (result.error || !result.response || (result.response && result.response.error)) {
                console.log(result.response.error)
                return alert('Ошибка при редактировании категории дохода')
            }

        }

        return this.openNewRoute('/expense')
    }
    cancelExpenseClick() {
        return this.openNewRoute('/expense')
    }

}