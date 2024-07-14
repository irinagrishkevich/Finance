import config from "../../config/config";
import {HttpUtils} from "../../utils/http-utils";

export class Income{
    constructor(openNewRoute){
        this.openNewRoute = openNewRoute;

        this.incomeCategoriesElement = document.getElementById('income-categories')

        this.loadIncomeCategories().then()
    }

    async loadIncomeCategories(){
        const incomeCategories = await HttpUtils.request('/categories/income')
        this.incomeCategoriesElement.innerHTML = ''
        incomeCategories.response.forEach(incomeCategory => {

            const incomeCategoryElement = document.createElement('div')
            incomeCategoryElement.classList.add('border', 'border-light-subtle', 'rounded-3', 'p-3')
            const incomeCategoryTitleElement = document.createElement('h3')
            incomeCategoryTitleElement.classList.add('mb-3', 'fw-bold')
            incomeCategoryTitleElement.innerText = incomeCategory.title
            const incomeCategoryEditElement = document.createElement('a')
            incomeCategoryEditElement.classList.add('btn', 'btn-primary', 'me-1', 'mb-1')
            incomeCategoryEditElement.innerText = 'Редактировать'
            incomeCategoryEditElement.href = '/income/edit?id=' + incomeCategory.id
            const incomeCategoryDeleteElement = document.createElement('button')
            incomeCategoryDeleteElement.classList.add('btn', 'btn-danger', 'me-5')
            incomeCategoryDeleteElement.innerText = 'Удалить'
            incomeCategoryDeleteElement.setAttribute('data-bs-toggle', 'modal');
            incomeCategoryDeleteElement.setAttribute('data-bs-target', '#deleteIncomeCategory')

            incomeCategoryElement.appendChild(incomeCategoryTitleElement)
            incomeCategoryElement.appendChild(incomeCategoryEditElement)
            incomeCategoryElement.appendChild(incomeCategoryDeleteElement)

            this.incomeCategoriesElement.appendChild(incomeCategoryElement)

            incomeCategoryDeleteElement.addEventListener('click', () => {
                this.openNewRoute('/income/delete?id=' + incomeCategory.id)
            })




        })

        const incomeCategoryAddElement = document.createElement('div')
        incomeCategoryAddElement.classList.add('border', 'border-light-subtle', 'rounded-3', 'p-3', 'd-flex', 'align-items-center', 'justify-content-center')
        incomeCategoryAddElement.style.width = '320px'
        incomeCategoryAddElement.style.cursor = 'pointer'
        incomeCategoryAddElement.style.height = '120px'
        incomeCategoryAddElement.innerText = '+'

        incomeCategoryAddElement.addEventListener('click', () => {
            this.openNewRoute('/income/create')
        })

        this.incomeCategoriesElement.appendChild(incomeCategoryAddElement)


    }
}