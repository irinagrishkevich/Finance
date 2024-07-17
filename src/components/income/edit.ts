
import {HttpUtils} from "../../utils/http-utils";
import {CategoriesIncomeType} from "../../types/categories-income.type";
import {DefaultResponseType} from "../../types/default-response.type";

export class IncomeEdit  {
    readonly openNewRoute: (url: string | null) => Promise<void>
    readonly saveIncome: HTMLInputElement | null
    readonly cancelIncome: HTMLInputElement | null
    readonly nameIncome: HTMLInputElement | null
    private IncomeCategoryData:  { id: number, title: string } | null

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute

        const urlParams: URLSearchParams = new URLSearchParams(window.location.search)
        const id: string = urlParams.get('id')
        if (!id) {
            return this.openNewRoute('/')
        }

        this.saveIncome = document.getElementById('saveIncome') as HTMLInputElement
        this.cancelIncome = document.getElementById('cancelIncome') as HTMLInputElement
        this.nameIncome = document.getElementById('nameIncome') as HTMLInputElement

        this.saveIncome.addEventListener('click', this.saveIncomeClick.bind(this))
        this.cancelIncome.addEventListener('click', this.cancelIncomeClick.bind(this))

        this.getIncome(id).then()
    }

    private async getIncome(id):Promise<void> {
        const result: CategoriesIncomeType | DefaultResponseType = await HttpUtils.request('/categories/income/'+ id )
        if ((result as DefaultResponseType).redirect) {
            return this.openNewRoute((result as DefaultResponseType).redirect)
        }

        if ((result as DefaultResponseType).error || !((result as CategoriesIncomeType).response || (result as CategoriesIncomeType).response)) {
            console.log("Ошибка при запросе категории дохода")
            return
            // console.log(result.response.message)
        }
        this.IncomeCategoryData = (result as CategoriesIncomeType).response
        if (this.nameIncome) {
            this.nameIncome.value = (result as CategoriesIncomeType).response.title
        }
    }
   private async saveIncomeClick(): Promise<void> {
        let changedData:string = ''
       if (this.nameIncome && this.IncomeCategoryData){
           if (this.nameIncome.value && this.nameIncome.value !== this.IncomeCategoryData.title) {
               changedData = this.nameIncome.value
           }
           if (changedData){
               const result: CategoriesIncomeType | DefaultResponseType = await HttpUtils.request('/categories/income/' + this.IncomeCategoryData.id, 'PUT',true, {
                   title: changedData
               })
               if ((result as DefaultResponseType).redirect) {
                   return this.openNewRoute((result as DefaultResponseType).redirect)
               }

               if ((result as DefaultResponseType).error || !(result as CategoriesIncomeType).response || ((result as CategoriesIncomeType).response)) {
                   // console.log(result.response.error)
                   console.log((result as DefaultResponseType).error)
                   return
               }

           }
       }



        return this.openNewRoute('/income')
    }
    private async cancelIncomeClick():Promise<void> {
        return  await this.openNewRoute('/income')
    }

}