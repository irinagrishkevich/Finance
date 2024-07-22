import {HttpUtils} from "../../utils/http-utils";
import {CategoriesIncomeType} from "../../types/categories-income.type";
import {DefaultResponseType} from "../../types/default-response.type";
import {OpenNewRouteFunction} from "../../types/open-new-route.type";

export class ExpenseEdit  {
    readonly openNewRoute: OpenNewRouteFunction
    readonly saveExpense: HTMLInputElement | null
    readonly cancelExpense: HTMLInputElement | null
    readonly nameExpense: HTMLInputElement | null
    private expenseCategoryData:  CategoriesIncomeType | null
    constructor(openNewRoute:OpenNewRouteFunction) {
        this.openNewRoute = openNewRoute
        this.expenseCategoryData = null

        const urlParams: URLSearchParams = new URLSearchParams(window.location.search)
        const id: string | null = urlParams.get('id')


        this.saveExpense = document.getElementById('saveExpense') as HTMLInputElement
        this.cancelExpense = document.getElementById('cancelExpense') as HTMLInputElement
        this.nameExpense = document.getElementById('nameExpense') as HTMLInputElement


        this.saveExpense.addEventListener('click', this.saveExpenseClick.bind(this))
        this.cancelExpense.addEventListener('click', this.cancelExpenseClick.bind(this))

        if (id) {
            this.getExpense(id).then()
        }else {
             this.openNewRoute('/').then()
        }

    }

    private async getExpense(id:string):Promise<void> {
        const result: CategoriesIncomeType | DefaultResponseType = await HttpUtils.request('/categories/expense/'+ id )
        if ((result as DefaultResponseType).redirect) {
            return this.openNewRoute('/login')
        }
        if ((result as DefaultResponseType).error || !(result as CategoriesIncomeType)) {
            console.log("Ошибка при запросе категории дохода")
            return
            // console.log(result.response.message)
        }
        this.expenseCategoryData = (result as CategoriesIncomeType)
        if (this.nameExpense) {
            this.nameExpense.value = (result as CategoriesIncomeType).title
        }

    }
    private async saveExpenseClick(): Promise<void> {
        let changedData: string = ''
        if (this.nameExpense && this.expenseCategoryData) {
            if (this.nameExpense.value && this.nameExpense.value !== this.expenseCategoryData.title) {
                changedData = this.nameExpense.value
            }
            if (changedData) {
                const result: CategoriesIncomeType | DefaultResponseType = await HttpUtils.request('/categories/expense/' + this.expenseCategoryData.id, 'PUT', true, {
                    title: changedData
                })
                if ((result as DefaultResponseType).redirect) {
                    return this.openNewRoute('/login')
                }
                if ((result as DefaultResponseType).error || !(result as CategoriesIncomeType)) {
                    console.log("Ошибка при редактировании категории расхода")
                    return
                }
            }

            return this.openNewRoute('/expense')
        }
    }
    private async cancelExpenseClick() : Promise<void> {
        return await this.openNewRoute('/expense')
    }

}