import {HttpUtils} from "../../utils/http-utils";

export class DeleteIncome {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute

        this.deleteIncomeBtnElement = document.getElementById('deleteIncomeBtn')
        this.cancelDeleteIncomeBtnElement = document.getElementById('cancelDeleteIncomeBtn')

        this.deleteIncomeBtnElement.addEventListener('click', this.deleteIncome.bind(this))
        this.cancelDeleteIncomeBtnElement.addEventListener('click', this.cancelDeleteIncome.bind(this))


    }
    async deleteIncome() {
        const urlParams = new URLSearchParams(window.location.search)

        const id = urlParams.get('id')
        if (!id) {
            return this.openNewRoute('/')
        }
        const result = await HttpUtils.request('/categories/income/' + id,  'DELETE' )
        if (result.redirect) {
            return this.openNewRoute(result.redirect)
        }
        if (result.error || !result.response || (result.response && result.response.error)) {
            console.log(result.response)
            return alert('Ошибка при удалении категории дохода')
        }
        return this.openNewRoute('/income')
    }
     cancelDeleteIncome() {
        this.openNewRoute('/income')
    }
}