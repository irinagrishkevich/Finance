import {HttpUtils} from "../../utils/http-utils";
import {CategoriesIncomeType} from "../../types/categories-income.type";
import {DefaultResponseType} from "../../types/default-response.type";
import {OpenNewRouteFunction} from "../../types/open-new-route.type";
import {AuthUtils} from "../../utils/auth-utils";

export class Expense {
    readonly openNewRoute: OpenNewRouteFunction
    readonly expenseCategoriesElement: HTMLElement | null

    constructor(openNewRoute:OpenNewRouteFunction) {
        this.openNewRoute = openNewRoute;

        this.expenseCategoriesElement = document.getElementById('expense-categories')

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login').then()
            return
        }

        this.loadExpenseCategories().then()
    }

    private async loadExpenseCategories(): Promise<void> {
        const expenseCategories: CategoriesIncomeType[] | DefaultResponseType = await HttpUtils.request('/categories/expense')
        if (this.expenseCategoriesElement) {
            this.expenseCategoriesElement.innerHTML = ''
        }
        (expenseCategories as CategoriesIncomeType[]).forEach(expenseCategory => {

            const expenseCategoryElement: HTMLElement = document.createElement('div')
            expenseCategoryElement.classList.add('border', 'border-light-subtle', 'rounded-3', 'p-3')
            const expenseCategoryTitleElement: HTMLElement = document.createElement('h3')
            expenseCategoryTitleElement.classList.add('mb-3', 'fw-bold')
            expenseCategoryTitleElement.innerText = expenseCategory.title
            const expenseCategoryEditElement: HTMLAnchorElement = document.createElement('a')
            expenseCategoryEditElement.classList.add('btn', 'btn-primary', 'me-1', 'mb-1')
            expenseCategoryEditElement.innerText = 'Редактировать'
            expenseCategoryEditElement.href = '/expense/edit?id=' + expenseCategory.id
            const expenseCategoryDeleteElement: HTMLButtonElement = document.createElement('button')
            expenseCategoryDeleteElement.classList.add('btn', 'btn-danger', 'me-5')
            expenseCategoryDeleteElement.innerText = 'Удалить'
            expenseCategoryDeleteElement.setAttribute('data-bs-toggle', 'modal');
            expenseCategoryDeleteElement.setAttribute('data-bs-target', '#deleteExpenseCategory')

            expenseCategoryElement.appendChild(expenseCategoryTitleElement)
            expenseCategoryElement.appendChild(expenseCategoryEditElement)
            expenseCategoryElement.appendChild(expenseCategoryDeleteElement)
            if (this.expenseCategoriesElement) {
                this.expenseCategoriesElement.appendChild(expenseCategoryElement)
            }

            expenseCategoryDeleteElement.addEventListener('click', () => {
                this.openNewRoute('/expense/delete?id=' + expenseCategory.id)
            })


        })

        const expenseCategoryAddElement: HTMLDivElement = document.createElement('div')
        expenseCategoryAddElement.classList.add('border', 'border-light-subtle', 'rounded-3', 'p-3', 'd-flex', 'align-items-center', 'justify-content-center')
        expenseCategoryAddElement.style.width = '320px'
        expenseCategoryAddElement.style.cursor = 'pointer'
        expenseCategoryAddElement.style.height = '120px'
        expenseCategoryAddElement.innerText = '+'

        expenseCategoryAddElement.addEventListener('click', () => {
            this.openNewRoute('/expense/create')
        })
        if (this.expenseCategoriesElement) {
            this.expenseCategoriesElement.appendChild(expenseCategoryAddElement)
        }


    }
}