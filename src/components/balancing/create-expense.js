import {HttpUtils} from "../../utils/http-utils";


export class CreateExpenseBalancing {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.categoryElement = null
        this.typeCategoryName = null


        this.typeSelectElement = document.getElementById('typeSelect');
        this.categorySelectElement = document.getElementById('categorySelect');
        this.sumSelectElement = document.getElementById('sumInput');
        this.dateSelectElement = document.getElementById('dateInput');
        this.commentSelectElement = document.getElementById('commentInput');



        document.getElementById('saveButton').addEventListener('click', this.saveIncome.bind(this))
        document.getElementById('cancelButton').addEventListener('click',this.cancelIncome.bind(this))

        this.showCategory().then()
    }



    validateField() {
        let isValid = true
        if (this.categorySelectElement.value === 'disabled') {
            this.categorySelectElement.classList.add('is-invalid')
            isValid = false

        } else {
            this.categorySelectElement.classList.remove('is-invalid')
        }


        if (this.sumSelectElement.value && this.sumSelectElement.value > 0) {
            this.sumSelectElement.classList.remove('is-invalid')
        } else {
            this.sumSelectElement.classList.add('is-invalid')
            isValid = false
        }
        if (this.dateSelectElement.value) {
            this.dateSelectElement.classList.remove('is-invalid')
        } else {
            this.dateSelectElement.classList.add('is-invalid')
            isValid = false
        }
        if (this.commentSelectElement.value) {
            this.commentSelectElement.classList.remove('is-invalid')
        } else {
            this.commentSelectElement.classList.add('is-invalid')
            isValid = false
        }

        return isValid
    }

    async showCategory(){
        const result = await HttpUtils.request('/categories/expense');
        result.response.forEach((expenseCategory) => {
            this.categoryElement = document.createElement('option');
            this.categoryElement.value = expenseCategory.id;
            this.categoryElement.innerText = expenseCategory.title;
            this.categorySelectElement.appendChild(this.categoryElement);
            this.typeCategoryName = 'expense'
        });
        this.typeSelectElement.addEventListener('change',  (e) => {
            if (e.target.value === '1') {
                try {
                    this.openNewRoute('/balancing/create-income')
                } catch (error) {
                    console.error('Ошибка при загрузке категорий доходов:', error);
                }
            }
        });
    }

    async saveIncome(e) {
        e.preventDefault()
        if (this.validateField()) {

            const createData = {
                type: this.typeCategoryName,
                amount: parseInt(this.sumSelectElement.value),
                date: this.dateSelectElement.value,
                comment: this.commentSelectElement.value,
                category_id: parseInt(this.categorySelectElement.value),
            }

            const result = await HttpUtils.request('/operations', 'POST', true, createData)


            if (result.error || !result.response || (result.response && (!result.response.type || !result.response.amount || !result.response.date || !result.response.comment || !result.response.id || !result.response.category))){
                alert('Что-то пошло не так')
                return
            }

            this.openNewRoute('/balancing')
        }

    }
    cancelIncome(e) {
        e.preventDefault()
        this.openNewRoute('/balancing')
    }
}