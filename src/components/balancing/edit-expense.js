import {HttpUtils} from "../../utils/http-utils";


export class EditExpenseBalancing {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute
        this.tableId = null
        this.typeCategoryName = null

        const urlParams = new URLSearchParams(window.location.search)
        const id = urlParams.get('id')
        if (!id) {
            return this.openNewRoute('/')
        }

        this.typeSelectElement = document.getElementById('typeSelect')
        this.categorySelectElement = document.getElementById('categorySelect')
        this.sumInputElement = document.getElementById('sumInput')
        this.dateInputElement = document.getElementById('dateInput')
        this.commentInputElement = document.getElementById('commentInput')

        this.saveIncome = document.getElementById('saveButton')
        this.cancelIncome = document.getElementById('cancelButton')



        this.saveIncome.addEventListener('click', this.saveIncomeClick.bind(this))
        this.cancelIncome.addEventListener('click', this.cancelIncomeClick.bind(this))

        this.getOperation(id).then()
    }
    async showCategory(){
        const result = await HttpUtils.request('/categories/expense');
        result.response.forEach((incomeCategory) => {
            this.categoryElement = document.createElement('option');
            this.categoryElement.value = incomeCategory.id;
            this.categoryElement.innerText = incomeCategory.title;
            this.categorySelectElement.appendChild(this.categoryElement);
            this.typeCategoryName = 'expense'
        })
    }

    async getOperation(id) {
        const result = await HttpUtils.request('/operations/' + id)
        if (result.redirect) {
            return this.openNewRoute(result.redirect)
        }
        if (result.error || !result.response || (result.response && result.response.error)) {
            console.log(result.response.message)
            return alert('Ошибка при запросе категории дохода')
        }

        this.operationData = result.response
        console.log(result.response)
        this.showOperation()

    }

    showOperation(){
        this.categorySelectElement.value = this.operationData.category
        this.categorySelectElement.setAttribute('selected', 'selected')
        this.showCategory().then()
        this.sumInputElement.value = this.operationData.amount
        this.dateInputElement.value = this.operationData.date
        this.commentInputElement.value = this.operationData.comment
        this.tableId = this.operationData.id
        this.typeSelectElement.addEventListener('change',  async(e) => {
            if (e.target.value === '2') {
                try {
                    this.categorySelectElement.innerHTML = ''
                    const result = await HttpUtils.request('/categories/income');
                    result.response.forEach((incomeCategory) => {
                        this.categoryElement = document.createElement('option');
                        this.categoryElement.value = incomeCategory.id;
                        this.categoryElement.innerText = incomeCategory.title;
                        this.categorySelectElement.appendChild(this.categoryElement);
                        this.typeCategoryName = 'income'
                    })
                } catch (error) {
                    console.error('Ошибка при загрузке категорий доходов:', error);
                }
            }
        });
    }
    validateField() {
        let isValid = true
        if (this.sumInputElement.value && this.sumInputElement.value > 0) {
            this.sumInputElement.classList.remove('is-invalid')
        } else {
            this.sumInputElement.classList.add('is-invalid')
            isValid = false
        }
        if (this.dateInputElement.value) {
            this.dateInputElement.classList.remove('is-invalid')
        } else {
            this.dateInputElement.classList.add('is-invalid')
            isValid = false
        }
        if (this.commentInputElement.value) {
            this.commentInputElement.classList.remove('is-invalid')
        } else {
            this.commentInputElement.classList.add('is-invalid')
            isValid = false
        }

        return isValid
    }
    async saveIncomeClick() {
        if (this.validateField()) {
            let changedData = {
                type : this.typeCategoryName,
                amount : parseInt(this.sumInputElement.value),
                date : this.dateInputElement.value,
                comment : this.commentInputElement.value,
                category_id : parseInt(this.categorySelectElement.value)
            }
            console.log(changedData)
            if (changedData){
                const result = await HttpUtils.request('/operations/' + this.tableId, 'PUT',true, changedData)
                if (result.redirect) {
                    return this.openNewRoute(result.redirect)
                }

                if (result.error || !result.response || (result.response && result.response.error)) {
                    console.log(result.response.error)
                    return alert('Ошибка при редактировании категории дохода')
                }

            }
            return this.openNewRoute('/balancing')
        }

    }
    cancelIncomeClick() {
        return this.openNewRoute('/balancing')
    }

}