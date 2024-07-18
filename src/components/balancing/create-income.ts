import {HttpUtils} from "../../utils/http-utils";
import {CategoriesIncomeType} from "../../types/categories-income.type";
import {DefaultResponseType} from "../../types/default-response.type";
import {CreateDataType} from "../../types/create-data.type";
import {BalancingType} from "../../types/balancing.type";

export class CreateIncomeBalancing {
    readonly openNewRoute: (url: string | null) => Promise<void>
    private categoryElement: HTMLOptionElement | null
    private typeCategoryName: string | null
    readonly typeSelectElement: HTMLInputElement | null
    readonly categorySelectElement: HTMLInputElement | null
    readonly sumSelectElement: HTMLInputElement | null
    readonly dateSelectElement: HTMLInputElement | null
    readonly commentSelectElement: HTMLInputElement | null

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.categoryElement = null
        this.typeCategoryName = null


        this.typeSelectElement = document.getElementById('typeSelect') as HTMLInputElement;
        this.categorySelectElement = document.getElementById('categorySelect') as HTMLInputElement;
        this.sumSelectElement = document.getElementById('sumInput') as HTMLInputElement;
        this.dateSelectElement = document.getElementById('dateInput') as HTMLInputElement;
        this.commentSelectElement = document.getElementById('commentInput') as HTMLInputElement;


        document.getElementById('saveButton').addEventListener('click', this.saveIncome.bind(this))
        document.getElementById('cancelButton').addEventListener('click', this.cancelIncome.bind(this))

        this.showCategory().then()
    }


    private validateField(): boolean {
        let isValid: boolean = true

        if (this.typeSelectElement) {
            if (this.typeSelectElement.value === '1' || this.typeSelectElement.value === '2') {
                this.typeSelectElement.classList.remove('is-invalid')
            } else if (this.typeSelectElement.value === 'disabled') {
                this.typeSelectElement.classList.add('is-invalid')
                isValid = false
            }
        }

        if (this.sumSelectElement) {
            if (this.sumSelectElement.value && this.sumSelectElement.value > 0) {
                this.sumSelectElement.classList.remove('is-invalid')
            } else {
                this.sumSelectElement.classList.add('is-invalid')
                isValid = false
            }
        }

        if (this.dateSelectElement) {
            if (this.dateSelectElement.value) {
                this.dateSelectElement.classList.remove('is-invalid')
            } else {
                this.dateSelectElement.classList.add('is-invalid')
                isValid = false
            }
        }
        if (this.commentSelectElement) {
            if (this.commentSelectElement.value) {
                this.commentSelectElement.classList.remove('is-invalid')
            } else {
                this.commentSelectElement.classList.add('is-invalid')
                isValid = false
            }
        }


        return isValid
    }

    private async showCategory(): Promise<void> {
        const result: CategoriesIncomeType | DefaultResponseType = await HttpUtils.request('/categories/income');
        (result as CategoriesIncomeType).response.forEach((incomeCategory): void => {
            this.categoryElement = document.createElement('option');
            this.categoryElement.value = incomeCategory.id;
            this.categoryElement.innerText = incomeCategory.title;
            if(this.categorySelectElement){
                this.categorySelectElement.appendChild(this.categoryElement);
            }
            this.typeCategoryName = 'income'
        })
        if (this.typeSelectElement) {
            this.typeSelectElement.addEventListener('change', (e: Event): void => {
                if ((e.target as HTMLSelectElement).value === '2') {
                    try {
                        this.openNewRoute('/balancing/create-expense')
                    } catch (error) {
                        console.error('Ошибка при загрузке категорий доходов:', error);
                    }
                }
            });
        }

    }


    private async saveIncome(e): Promise<void> {
        e.preventDefault()
        if (this.validateField()) {
            if(this.typeCategoryName && this.sumSelectElement && this.dateSelectElement && this.commentSelectElement && this.categorySelectElement){
                const createData: CreateDataType | null = {
                    type: this.typeCategoryName,
                    amount: parseInt(this.sumSelectElement.value),
                    date: this.dateSelectElement.value,
                    comment: this.commentSelectElement.value,
                    category_id: parseInt(this.categorySelectElement.value),
                }


                const result:BalancingType | DefaultResponseType = await HttpUtils.request('/operations', 'POST', true, createData)

                if ((result as DefaultResponseType).error || !((result as BalancingType).response || (result as BalancingType).response)) {
                    alert('Что-то пошло не так')
                    return
                }


            }


            await this.openNewRoute('/balancing')
        }

    }

    private async cancelIncome(e): Promise<void> {
        e.preventDefault()
        await this.openNewRoute('/balancing')
    }
}