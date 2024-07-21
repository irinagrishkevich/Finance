import {HttpUtils} from "../../utils/http-utils";
import {CategoriesIncomeType} from "../../types/categories-income.type";
import {DefaultResponseType} from "../../types/default-response.type";
import {OpenNewRouteFunction} from "../../types/open-new-route.type";

export class IncomeEdit {
    readonly openNewRoute: OpenNewRouteFunction
    readonly saveIncome: HTMLInputElement | null
    readonly cancelIncome: HTMLInputElement | null
    readonly nameIncome: HTMLInputElement | null
    private IncomeCategoryData: CategoriesIncomeType | null

    constructor(openNewRoute: OpenNewRouteFunction) {
        this.openNewRoute = openNewRoute
        this.IncomeCategoryData = null

        const urlParams: URLSearchParams = new URLSearchParams(window.location.search)
        const id: string | null = urlParams.get('id')


        this.saveIncome = document.getElementById('saveIncome') as HTMLInputElement
        this.cancelIncome = document.getElementById('cancelIncome') as HTMLInputElement
        this.nameIncome = document.getElementById('nameIncome') as HTMLInputElement

        this.saveIncome.addEventListener('click', this.saveIncomeClick.bind(this))
        this.cancelIncome.addEventListener('click', this.cancelIncomeClick.bind(this))


        if (id) {
            this.getIncome(id).then()
        } else {
            this.openNewRoute('/').then()
        }


    }

    private async getIncome(id: string): Promise<void> {
        const result: CategoriesIncomeType | DefaultResponseType = await HttpUtils.request('/categories/income/' + id)
        if ((result as DefaultResponseType).redirect) {
            await this.openNewRoute('/login')
        }

        if ((result as DefaultResponseType).error || !(result as CategoriesIncomeType)) {
            console.log("Ошибка при запросе категории дохода")
            return
            // console.log(result.response.message)
        }
        this.IncomeCategoryData = (result as CategoriesIncomeType)
        if (this.nameIncome) {
            this.nameIncome.value = (result as CategoriesIncomeType).title
        }
    }

    private async saveIncomeClick(): Promise<void> {
        let changedData: string = ''
        if (this.nameIncome && this.IncomeCategoryData) {
            if (this.nameIncome.value && this.nameIncome.value !== this.IncomeCategoryData.title) { // проверка на совпадение заголовка и название
                changedData = this.nameIncome.value
            }
            if (changedData) {
                const result: CategoriesIncomeType | DefaultResponseType = await HttpUtils.request('/categories/income/' + this.IncomeCategoryData.id, 'PUT', true, {
                    title: changedData
                })
                if ((result as DefaultResponseType).redirect) {
                    await this.openNewRoute('/login')
                }

                if ((result as DefaultResponseType).error || !(result as CategoriesIncomeType)) {
                    // console.log(result.response.error)
                    console.log((result as DefaultResponseType).error)
                    return
                }

            }
        }


        return this.openNewRoute('/income')
    }

    private async cancelIncomeClick(): Promise<void> {
        return await this.openNewRoute('/income')
    }

}