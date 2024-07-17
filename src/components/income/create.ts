import {HttpUtils} from "../../utils/http-utils";
import {CategoriesIncomeType} from "../../types/categories-income.type";
import {DefaultResponseType} from "../../types/default-response.type";

export class IncomeCreate{
    readonly openNewRoute: (url: string | null) => Promise<void>
    readonly createIncome: HTMLInputElement | null
    readonly cancelIncome: HTMLInputElement | null
    readonly nameIncome: HTMLInputElement | null
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute

        this.createIncome = document.getElementById('createIncome') as HTMLInputElement
        this.cancelIncome = document.getElementById('cancelIncome') as HTMLInputElement
        this.nameIncome = document.getElementById('nameIncome') as HTMLInputElement

        this.createIncome.addEventListener('click', this.createIncomeClick.bind(this))
        this.cancelIncome.addEventListener('click', this.cancelIncomeClick.bind(this))

    }
    private async createIncomeClick(): Promise<void> {
        if(this.nameIncome && this.nameIncome.value) {
            const result: CategoriesIncomeType | DefaultResponseType = await HttpUtils.request('/categories/income', 'POST', true, {
                title: this.nameIncome.value
            })
            if ((result as DefaultResponseType).redirect) {
                return this.openNewRoute((result as DefaultResponseType).redirect)
            }

            if ((result as DefaultResponseType).error || !((result as CategoriesIncomeType).response || (result as CategoriesIncomeType).response)) {
                console.log("Ошибка при создании категории дохода")
                return
            }

            return this.openNewRoute('/income')
        }else{
            alert('Введите название дохода')
        }
    }
    private async cancelIncomeClick(e): Promise<void> {
        e.preventDefault()
        await this.openNewRoute('/income')
    }
}