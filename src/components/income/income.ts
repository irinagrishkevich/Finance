import {HttpUtils} from "../../utils/http-utils";
import {CategoriesIncomeType} from "../../types/categories-income.type";
import {DefaultResponseType} from "../../types/default-response.type";
import {OpenNewRouteFunction} from "../../types/open-new-route.type";
import {AuthUtils} from "../../utils/auth-utils";

export class Income {
    readonly openNewRoute: OpenNewRouteFunction
    readonly incomeCategoriesElement: HTMLElement | null

    constructor(openNewRoute: OpenNewRouteFunction) {
        this.openNewRoute = openNewRoute;

        this.incomeCategoriesElement = document.getElementById('income-categories')

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login').then()
            return
        }

        this.loadIncomeCategories().then()
    }

    private async loadIncomeCategories(): Promise<void> {
        const incomeCategories: CategoriesIncomeType[] | DefaultResponseType = await HttpUtils.request('/categories/income')
        if (this.incomeCategoriesElement) {
            this.incomeCategoriesElement.innerHTML = ''
        }

        (incomeCategories as CategoriesIncomeType[]).forEach(incomeCategory => {

            const incomeCategoryElement: HTMLElement = document.createElement('div')
            incomeCategoryElement.classList.add('border', 'border-light-subtle', 'rounded-3', 'p-3')
            const incomeCategoryTitleElement: HTMLElement = document.createElement('h3')
            incomeCategoryTitleElement.classList.add('mb-3', 'fw-bold')
            incomeCategoryTitleElement.innerText = incomeCategory.title
            const incomeCategoryEditElement: HTMLAnchorElement = document.createElement('a')
            incomeCategoryEditElement.classList.add('btn', 'btn-primary', 'me-1', 'mb-1')
            incomeCategoryEditElement.innerText = 'Редактировать'
            incomeCategoryEditElement.href = '/income/edit?id=' + incomeCategory.id
            const incomeCategoryDeleteElement: HTMLButtonElement = document.createElement('button')
            incomeCategoryDeleteElement.classList.add('btn', 'btn-danger', 'me-5')
            incomeCategoryDeleteElement.innerText = 'Удалить'
            incomeCategoryDeleteElement.setAttribute('data-bs-toggle', 'modal');
            incomeCategoryDeleteElement.setAttribute('data-bs-target', '#deleteIncomeCategory')

            incomeCategoryElement.appendChild(incomeCategoryTitleElement)
            incomeCategoryElement.appendChild(incomeCategoryEditElement)
            incomeCategoryElement.appendChild(incomeCategoryDeleteElement)
            if (this.incomeCategoriesElement) {
                this.incomeCategoriesElement.appendChild(incomeCategoryElement)

            }

            incomeCategoryDeleteElement.addEventListener('click', () => {
                this.openNewRoute('/income/delete?id=' + incomeCategory.id)
            })


        })

        const incomeCategoryAddElement: HTMLDivElement = document.createElement('div')
        incomeCategoryAddElement.classList.add('border', 'border-light-subtle', 'rounded-3', 'p-3', 'd-flex', 'align-items-center', 'justify-content-center')
        incomeCategoryAddElement.style.width = '320px'
        incomeCategoryAddElement.style.cursor = 'pointer'
        incomeCategoryAddElement.style.height = '120px'
        incomeCategoryAddElement.innerText = '+'

        incomeCategoryAddElement.addEventListener('click', () => {
            this.openNewRoute('/income/create')
        })
        if (this.incomeCategoriesElement) {
            this.incomeCategoriesElement.appendChild(incomeCategoryAddElement)

        }


    }
}