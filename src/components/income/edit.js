import {HttpUtils} from "../../utils/http-utils";

export class IncomeEdit  {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute

        const urlParams = new URLSearchParams(window.location.search)
        const id = urlParams.get('id')
        if (!id) {
            return this.openNewRoute('/')
        }

        this.saveIncome = document.getElementById('saveIncome')
        this.cancelIncome = document.getElementById('cancelIncome')
        this.nameIncome = document.getElementById('nameIncome')


        this.saveIncome.addEventListener('click', this.saveIncomeClick.bind(this))
        this.cancelIncome.addEventListener('click', this.cancelIncomeClick.bind(this))

        this.getIncome(id).then()
    }

    async getIncome(id) {
        const result = await HttpUtils.request('/categories/income/'+ id )
        if (result.redirect) {
            return this.openNewRoute(result.redirect)
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            console.log(result.response.message)
            return alert('Ошибка при запросе категории дохода')
        }
        this.IncomeCategoryData = result.response
        this.nameIncome.value = result.response.title
    }
    async saveIncomeClick() {
        let changedData = ''
        if (this.nameIncome.value && this.nameIncome.value !== this.IncomeCategoryData.title) {
            changedData = this.nameIncome.value
        }
        if (changedData){
            const result = await HttpUtils.request('/categories/income/' + this.IncomeCategoryData.id, 'PUT',true, {
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

        return this.openNewRoute('/income')
    }
    cancelIncomeClick() {
        return this.openNewRoute('/income')
    }

}