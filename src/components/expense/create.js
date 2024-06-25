

import {HttpUtils} from "../../utils/http-utils";

export class ExpenseCreate{
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute

        this.createExpense = document.getElementById('createExpense')
        this.cancelExpense = document.getElementById('cancelExpense')
        this.nameExpense = document.getElementById('nameExpense')

        this.createExpense.addEventListener('click', this.createExpenseClick.bind(this))
        this.cancelExpense.addEventListener('click', this.cancelExpenseClick.bind(this))

    }
    async createExpenseClick() {
        if(this.nameExpense.value) {
            const result = await HttpUtils.request('/categories/expense', 'POST', true, {
                title: this.nameExpense.value
            })
            if (result.redirect) {
                return this.openNewRoute(result.redirect)
            }

            if (result.error || !result.response || (result.response && result.response.error)) {
                console.log(result.response.error)
                return alert('Ошибка при создании категории дохода')
            }

            return this.openNewRoute('/expense')
        }else{
            alert('Введите название дохода')
        }
    }
    cancelExpenseClick(e) {
        e.preventDefault()
        this.openNewRoute('/expense')
    }
}