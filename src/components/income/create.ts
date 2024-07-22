import {HttpUtils} from "../../utils/http-utils";
import {CategoriesIncomeType} from "../../types/categories-income.type";
import {DefaultResponseType} from "../../types/default-response.type";
import {OpenNewRouteFunction} from "../../types/open-new-route.type";
import {AuthUtils} from "../../utils/auth-utils";

export class IncomeCreate{
    readonly openNewRoute: OpenNewRouteFunction
    readonly createIncome: HTMLInputElement | null
    readonly cancelIncome: HTMLInputElement | null
    readonly nameIncome: HTMLInputElement | null
    constructor(openNewRoute: OpenNewRouteFunction) {
        this.openNewRoute = openNewRoute

        this.createIncome = document.getElementById('createIncome') as HTMLInputElement
        this.cancelIncome = document.getElementById('cancelIncome') as HTMLInputElement
        this.nameIncome = document.getElementById('nameIncome') as HTMLInputElement

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login').then()
            return
        }

        this.createIncome.addEventListener('click', this.createIncomeClick.bind(this))
        this.cancelIncome.addEventListener('click', this.cancelIncomeClick.bind(this))



    }
    private async createIncomeClick(): Promise<void> {
        if(this.nameIncome && this.nameIncome.value) {
            const result: CategoriesIncomeType | DefaultResponseType = await HttpUtils.request('/categories/income', 'POST', true, {
                title: this.nameIncome.value
            })
            if ((result as DefaultResponseType).redirect) {
                return this.openNewRoute('/login')
            }

            if ((result as DefaultResponseType).error || !(result as CategoriesIncomeType)) {
                console.log("Ошибка при создании категории дохода")
                return
            }

            return this.openNewRoute('/income')
        }else{
            alert('Введите название дохода')
        }
    }
    private async cancelIncomeClick(e: Event): Promise<void> {
        e.preventDefault()
        await this.openNewRoute('/income')
    }
}