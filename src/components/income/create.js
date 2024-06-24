import {HttpUtils} from "../../utils/http-utils";

export class IncomeCreate{
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute

        this.createIncome = document.getElementById('createIncome')
        this.cancelIncome = document.getElementById('cancelIncome')
        this.nameIncome = document.getElementById('nameIncome')

        this.createIncome.addEventListener('click', this.createIncomeClick.bind(this))
        this.cancelIncome.addEventListener('click', this.cancelIncomeClick.bind(this))

    }
    async createIncomeClick() {
        if(this.nameIncome.value) {
            const result = await HttpUtils.request('/categories/income', 'POST', true, {
                title: this.nameIncome.value
            })
            if (result.redirect) {
                return this.openNewRoute(result.redirect)
            }

            if (result.error || !result.response || (result.response && result.response.error)) {
                console.log(result.response.error)
                return alert('Ошибка при запросе категории')
            }

            return this.openNewRoute('/income')
        }else{
            alert('Введите название дохода')
        }
    }
    cancelIncomeClick(e) {
        e.preventDefault()
        this.openNewRoute('/income')
    }
}