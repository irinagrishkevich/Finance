import {HttpUtils} from "../../utils/http-utils";
import {CategoriesIncomeType} from "../../types/categories-income.type";
import {DefaultResponseType} from "../../types/default-response.type";
import {BalancingType} from "../../types/balancing.type";
import {CreateDataType} from "../../types/create-data.type";
import {OpenNewRouteFunction} from "../../types/open-new-route.type";


export class EditExpenseBalancing {
    readonly openNewRoute: OpenNewRouteFunction

    private typeCategoryName: string | null
    readonly sumInputElement: HTMLInputElement | null
    readonly dateInputElement: HTMLInputElement | null
    readonly commentInputElement: HTMLInputElement | null
    readonly categorySelectElement: HTMLInputElement | null
    readonly typeSelectElement: HTMLSelectElement | null
    readonly saveIncome: HTMLInputElement | null
    readonly cancelIncome: HTMLInputElement | null
    private categoryElement: HTMLOptionElement | null
    private operationData: BalancingType | null

    constructor(openNewRoute:OpenNewRouteFunction) {
        this.openNewRoute = openNewRoute

        this.typeCategoryName = null
        this.categoryElement = null
        this.operationData = null

        const urlParams: URLSearchParams = new URLSearchParams(window.location.search)
        const id: string | null = urlParams.get('id')


        this.typeSelectElement = document.getElementById('typeSelect') as HTMLSelectElement;
        this.categorySelectElement = document.getElementById('categorySelect') as HTMLInputElement;
        this.sumInputElement = document.getElementById('sumInput') as HTMLInputElement;
        this.dateInputElement = document.getElementById('dateInput') as HTMLInputElement;
        this.commentInputElement = document.getElementById('commentInput') as HTMLInputElement;

        this.saveIncome = document.getElementById('saveButton') as HTMLInputElement;
        this.cancelIncome = document.getElementById('cancelButton') as HTMLInputElement;


        this.saveIncome.addEventListener('click', this.saveIncomeClick.bind(this))
        this.cancelIncome.addEventListener('click', this.cancelIncomeClick.bind(this))

        if (id) {
            this.getOperation(id).then()
        }else {
            this.openNewRoute('/').then()
        }

    }

    private async showCategory(): Promise<void> {
        const result: CategoriesIncomeType[] | DefaultResponseType = await HttpUtils.request('/categories/expense');
        (result as CategoriesIncomeType[]).forEach((incomeCategory): void => {
            this.categoryElement = document.createElement('option');
            this.categoryElement.value = incomeCategory.id.toString();
            this.categoryElement.innerText = incomeCategory.title;
            if (this.categorySelectElement) {
                this.categorySelectElement.appendChild(this.categoryElement);
            }
            this.typeCategoryName = 'expense'
        })
    }

    private async getOperation(id: string): Promise<void> {
        const result: DefaultResponseType | BalancingType = await HttpUtils.request('/operations/' + id)
        if ((result as DefaultResponseType).redirect) {
            return this.openNewRoute('/login')
        }
        if ((result as DefaultResponseType).error || !(result as BalancingType)) {
            console.log("Ошибка при запросе категории дохода")
            return
        }

        this.operationData = (result as BalancingType)
        // console.log(result.response)
        this.showOperation()

    }

    private showOperation(): void {
        if (this.operationData) {
            if (this.categorySelectElement) {
                this.categorySelectElement.value = this.operationData.category
                this.categorySelectElement.setAttribute('selected', 'selected')
            }
            this.showCategory().then()
            if (this.sumInputElement) {
                this.sumInputElement.value = (this.operationData.amount).toString()
            }
            if (this.dateInputElement) {
                this.dateInputElement.value = this.operationData.date
            }
            if (this.commentInputElement) {
                this.commentInputElement.value = this.operationData.comment
            }
            if (this.typeSelectElement) {
                this.typeSelectElement.addEventListener('change', async (e: Event) => {
                    if ((e.target as HTMLSelectElement).value === '2') {
                        try {
                            if (this.categorySelectElement) {
                                this.categorySelectElement.innerHTML = ''
                            }
                            const result: CategoriesIncomeType[] | DefaultResponseType = await HttpUtils.request('/categories/income');
                            (result as CategoriesIncomeType[]).forEach((incomeCategory): void => {
                                this.categoryElement = document.createElement('option');
                                this.categoryElement.value = incomeCategory.id.toString();
                                this.categoryElement.innerText = incomeCategory.title;
                                if (this.categorySelectElement) {
                                    this.categorySelectElement.appendChild(this.categoryElement);
                                }
                                this.typeCategoryName = 'income'
                            })
                        } catch (error) {
                            console.error('Ошибка при загрузке категорий доходов:', error);
                        }
                    }
                });
            }

        }

    }

    private validateField():boolean {
        let isValid: boolean = true
        if (this.sumInputElement) {
            if (this.sumInputElement.value && parseInt(this.sumInputElement.value) > 0) {
                this.sumInputElement.classList.remove('is-invalid')
            } else {
                this.sumInputElement.classList.add('is-invalid')
                isValid = false
            }
        }

        if (this.dateInputElement) {
            if (this.dateInputElement.value) {
                this.dateInputElement.classList.remove('is-invalid')
            } else {
                this.dateInputElement.classList.add('is-invalid')
                isValid = false
            }
        }
            if (this.commentInputElement) {
                if (this.commentInputElement.value) {
                    this.commentInputElement.classList.remove('is-invalid')
                } else {
                    this.commentInputElement.classList.add('is-invalid')
                    isValid = false
                }

            }

            return isValid

    }

    private async saveIncomeClick(e: Event): Promise<void> {
        e.preventDefault()// add
        if (this.validateField()) {
            if(this.typeCategoryName && this.sumInputElement && this.dateInputElement && this.commentInputElement && this.categorySelectElement){
                let changedData: CreateDataType | null = {
                    type: this.typeCategoryName,
                    amount: parseInt(this.sumInputElement.value),
                    date: this.dateInputElement.value,
                    comment: this.commentInputElement.value,
                    category_id: parseInt(this.categorySelectElement.value)
                }
                if (changedData && this.operationData) {
                    const result: BalancingType | DefaultResponseType = await HttpUtils.request('/operations/' + this.operationData.id, 'PUT', true, changedData)
                    if ((result as DefaultResponseType).redirect) {
                        return this.openNewRoute('/login')
                    }

                    if ((result as DefaultResponseType).error || !(result as BalancingType)) {
                        console.log((result as DefaultResponseType).error)
                        return alert('Ошибка при редактировании категории дохода')
                    }

                }
            }

            return this.openNewRoute('/balancing')
        }

    }

    private async cancelIncomeClick():Promise<void> {
        return await this.openNewRoute('/balancing')
    }

}