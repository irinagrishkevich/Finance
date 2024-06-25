import {HttpUtils} from "../../utils/http-utils";

export class DeleteBalancingOperation {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute

        this.deleteBalancingCategoryBtn = document.getElementById('deleteIncomeBtn')
        this.cancelDeleteCategoryBtn = document.getElementById('cancelDeleteIncomeBtn')

        this.deleteBalancingCategoryBtn.addEventListener('click', this.deleteCategory.bind(this))
        this.cancelDeleteCategoryBtn.addEventListener('click', this.cancelDeleteCategory.bind(this))


    }

    async deleteCategory() {
        const urlParams = new URLSearchParams(window.location.search)

        const id = urlParams.get('id')
        if (!id) {
            return this.openNewRoute('/')
        }
        const result = await HttpUtils.request('/operations/' + id, 'DELETE')
        if (result.redirect) {
            return this.openNewRoute(result.redirect)
        }
        if (result.error || !result.response || (result.response && result.response.error)) {
            console.log(result.response)
            return alert('Ошибка при удалении категории дохода')
        }
        return this.openNewRoute('/balancing')
    }

    cancelDeleteCategory() {
        this.openNewRoute('/balancing')
    }
}