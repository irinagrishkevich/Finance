import {HttpUtils} from "../../utils/http-utils";
import {CategoriesIncomeType} from "../../types/categories-income.type";
import {DefaultResponseType} from "../../types/default-response.type";
import {OpenNewRouteFunction} from "../../types/open-new-route.type";

export class ExpenseCreate{
    readonly openNewRoute: OpenNewRouteFunction
    readonly createExpense: HTMLInputElement | null
    readonly cancelExpense: HTMLInputElement | null
    readonly nameExpense: HTMLInputElement | null
    constructor(openNewRoute:OpenNewRouteFunction) {
        this.openNewRoute = openNewRoute

        this.createExpense = document.getElementById('createExpense') as HTMLInputElement
        this.cancelExpense = document.getElementById('cancelExpense') as HTMLInputElement
        this.nameExpense = document.getElementById('nameExpense') as HTMLInputElement

        this.createExpense.addEventListener('click', this.createExpenseClick.bind(this))
        this.cancelExpense.addEventListener('click', this.cancelExpenseClick.bind(this))

    }
    private async createExpenseClick(): Promise<void> {
        if (this.nameExpense) {
            if(this.nameExpense.value) {
                const result: CategoriesIncomeType | DefaultResponseType = await HttpUtils.request('/categories/expense', 'POST', true, {
                    title: this.nameExpense.value
                })
                if ((result as DefaultResponseType).redirect) {
                    return this.openNewRoute('/login')
                }

                if ((result as DefaultResponseType).error || !(result as CategoriesIncomeType)) {
                    // console.log(result.response.error)
                    console.log((result as DefaultResponseType).error)
                    console.log('Ошибка при создании категории дохода')
                    return
                }

                return this.openNewRoute('/expense')
            }else{
                alert('Введите название дохода')
            }
        }
    }
    private async cancelExpenseClick(e: Event): Promise<void> {
        e.preventDefault()
        await this.openNewRoute('/expense')
    }
}