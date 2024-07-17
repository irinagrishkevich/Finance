import {HttpUtils} from "../../utils/http-utils";
import {CategoriesIncomeType} from "../../types/categories-income.type";
import {DefaultResponseType} from "../../types/default-response.type";

export class ExpenseEdit  {
    readonly openNewRoute: (url: string | null) => Promise<void>
    readonly saveExpense: HTMLInputElement | null
    readonly cancelExpense: HTMLInputElement | null
    readonly nameExpense: HTMLInputElement | null
    private ExpenseCategoryData:  { id: number, title: string } | null
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute

        const urlParams: URLSearchParams = new URLSearchParams(window.location.search)
        const id: string | null = urlParams.get('id')
        if (!id) {
            return this.openNewRoute('/')
        }

        this.saveExpense = document.getElementById('saveExpense') as HTMLInputElement
        this.cancelExpense = document.getElementById('cancelExpense') as HTMLInputElement
        this.nameExpense = document.getElementById('nameExpense') as HTMLInputElement


        this.saveExpense.addEventListener('click', this.saveExpenseClick.bind(this))
        this.cancelExpense.addEventListener('click', this.cancelExpenseClick.bind(this))

        this.getExpense(id).then()
    }

    private async getExpense(id):Promise<void> {
        const result: CategoriesIncomeType | DefaultResponseType = await HttpUtils.request('/categories/expense/'+ id )
        if ((result as DefaultResponseType).redirect) {
            return this.openNewRoute((result as DefaultResponseType).redirect)
        }
        if ((result as DefaultResponseType).error || !((result as CategoriesIncomeType).response || (result as CategoriesIncomeType).response)) {
            console.log("Ошибка при запросе категории дохода")
            return
            // console.log(result.response.message)
        }
        this.ExpenseCategoryData = (result as CategoriesIncomeType).response
        if (this.nameExpense) {
            this.nameExpense.value = (result as CategoriesIncomeType).response.title
        }

    }
    private async saveExpenseClick(): Promise<void> {
        let changedData: string = ''
        if (this.nameExpense && this.ExpenseCategoryData) {
            if (this.nameExpense.value && this.nameExpense.value !== this.ExpenseCategoryData.title) {
                changedData = this.nameExpense.value
            }
            if (changedData) {
                const result: CategoriesIncomeType | DefaultResponseType = await HttpUtils.request('/categories/expense/' + this.ExpenseCategoryData.id, 'PUT', true, {
                    title: changedData
                })
                if ((result as DefaultResponseType).redirect) {
                    return this.openNewRoute((result as DefaultResponseType).redirect)
                }
                if ((result as DefaultResponseType).error || !((result as CategoriesIncomeType).response || (result as CategoriesIncomeType).response)) {
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