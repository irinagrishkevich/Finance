import {HttpUtils} from "../../utils/http-utils";
import {CategoriesIncomeType} from "../../types/categories-income.type";
import {DefaultResponseType} from "../../types/default-response.type";
import {CreateDataType} from "../../types/create-data.type";
import {BalancingType} from "../../types/balancing.type";
import {OpenNewRouteFunction} from "../../types/open-new-route.type";


export class CreateExpenseBalancing {
    readonly openNewRoute: OpenNewRouteFunction
    readonly typeSelectElement: HTMLSelectElement | null
    readonly categorySelectElement: HTMLSelectElement | null
    readonly sumSelectElement: HTMLInputElement | null
    readonly dateSelectElement: HTMLInputElement | null
    readonly commentSelectElement: HTMLInputElement | null
    private typeCategoryName: string | null
    private categoryElement: HTMLOptionElement | null
    readonly saveButtonElement: HTMLInputElement | null
    readonly cancelButtonElement: HTMLInputElement | null

    constructor(openNewRoute:OpenNewRouteFunction) {
        this.openNewRoute = openNewRoute;
        this.categoryElement = null
        this.typeCategoryName = null


        this.typeSelectElement = document.getElementById('typeSelect') as HTMLSelectElement;
        this.categorySelectElement = document.getElementById('categorySelect') as HTMLSelectElement;
        this.sumSelectElement = document.getElementById('sumInput') as HTMLInputElement;
        this.dateSelectElement = document.getElementById('dateInput') as HTMLInputElement;
        this.commentSelectElement = document.getElementById('commentInput') as HTMLInputElement;
        this.saveButtonElement = document.getElementById('saveButton') as HTMLInputElement
        this.cancelButtonElement = document.getElementById('cancelButton') as HTMLInputElement


        this.saveButtonElement.addEventListener('click', this.saveIncome.bind(this))
        this.cancelButtonElement.addEventListener('click', this.cancelIncome.bind(this))

        this.showCategory().then()
    }


    private validateField(): boolean {
        let isValid: boolean = true
        if (this.categorySelectElement) {
            if (this.categorySelectElement.value === 'disabled') {
                this.categorySelectElement.classList.add('is-invalid')
                isValid = false

            } else {
                this.categorySelectElement.classList.remove('is-invalid')
            }
        }

        if (this.sumSelectElement) {
            if (this.sumSelectElement.value && parseInt(this.sumSelectElement.value) > 0) {
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
        const result: CategoriesIncomeType[] | DefaultResponseType = await HttpUtils.request('/categories/expense');
        (result as CategoriesIncomeType[]).forEach((expenseCategory): void => {
            this.categoryElement = document.createElement('option');
            this.categoryElement.value = expenseCategory.id.toString();
            this.categoryElement.innerText = expenseCategory.title;
            if (this.categorySelectElement) {
                this.categorySelectElement.appendChild(this.categoryElement);
            }
            this.typeCategoryName = 'expense'
        });
        if (this.typeSelectElement) {
            this.typeSelectElement.addEventListener('change', (e: Event): void => {
                if ((e.target as HTMLSelectElement).value === '1') {
                    try {
                        this.openNewRoute('/balancing/create-income')
                    } catch (error) {
                        console.error('Ошибка при загрузке категорий доходов:', error);
                    }
                }
            });
        }

    }

    private async saveIncome(e: Event): Promise<void> {
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


                if ((result as DefaultResponseType).error || !(result as BalancingType)) {
                    alert('Что-то пошло не так')
                    return

                }


            }

            await this.openNewRoute('/balancing')
        }

    }

    private async cancelIncome(e: Event): Promise<void> {
        e.preventDefault()
        await this.openNewRoute('/balancing')
    }
}