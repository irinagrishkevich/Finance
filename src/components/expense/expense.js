
import {HttpUtils} from "../../utils/http-utils";

export class Expense {
    constructor(openNewRoute){
        this.openNewRoute = openNewRoute;

        this.expenseCategoriesElement = document.getElementById('expense-categories')

        this.loadExpenseCategories().then()
    }

    async loadExpenseCategories(){
        const expenseCategories = await HttpUtils.request('/categories/expense')
        this.expenseCategoriesElement.innerHTML = ''
        expenseCategories.response.forEach(expenseCategory => {

            const expenseCategoryElement = document.createElement('div')
            expenseCategoryElement.classList.add('border', 'border-light-subtle', 'rounded-3', 'p-3')
            const expenseCategoryTitleElement = document.createElement('h3')
            expenseCategoryTitleElement.classList.add('mb-3', 'fw-bold')
            expenseCategoryTitleElement.innerText = expenseCategory.title
            const expenseCategoryEditElement = document.createElement('a')
            expenseCategoryEditElement.classList.add('btn', 'btn-primary', 'me-1', 'mb-1')
            expenseCategoryEditElement.innerText = 'Редактировать'
            expenseCategoryEditElement.href = '/expense/edit?id=' + expenseCategory.id
            const expenseCategoryDeleteElement = document.createElement('button')
            expenseCategoryDeleteElement.classList.add('btn', 'btn-danger', 'me-5')
            expenseCategoryDeleteElement.innerText = 'Удалить'
            expenseCategoryDeleteElement.setAttribute('data-bs-toggle', 'modal');
            expenseCategoryDeleteElement.setAttribute('data-bs-target', '#deleteExpenseCategory')

            expenseCategoryElement.appendChild(expenseCategoryTitleElement)
            expenseCategoryElement.appendChild(expenseCategoryEditElement)
            expenseCategoryElement.appendChild(expenseCategoryDeleteElement)

            this.expenseCategoriesElement.appendChild(expenseCategoryElement)

            expenseCategoryDeleteElement.addEventListener('click', () => {
                this.openNewRoute('/expense/delete?id=' + expenseCategory.id)
            })




        })

        const expenseCategoryAddElement = document.createElement('div')
        expenseCategoryAddElement.classList.add('border', 'border-light-subtle', 'rounded-3', 'p-3', 'd-flex', 'align-items-center', 'justify-content-center')
        expenseCategoryAddElement.style.width = '320px'
        expenseCategoryAddElement.style.cursor = 'pointer'
        expenseCategoryAddElement.style.height = '120px'
        expenseCategoryAddElement.innerText = '+'

        expenseCategoryAddElement.addEventListener('click', () => {
            this.openNewRoute('/expense/create')
        })

        this.expenseCategoriesElement.appendChild(expenseCategoryAddElement)


    }
}