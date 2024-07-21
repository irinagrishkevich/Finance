import {HttpUtils} from "../../utils/http-utils";
import {DefaultResponseType} from "../../types/default-response.type";
import {OpenNewRouteFunction} from "../../types/open-new-route.type";

export class DeleteBalancingOperation {
    readonly openNewRoute: OpenNewRouteFunction;
    private deleteBalancingCategoryBtn: HTMLInputElement | null;
    private cancelDeleteCategoryBtn: HTMLInputElement | null;
    constructor(openNewRoute:OpenNewRouteFunction) {
        this.openNewRoute = openNewRoute

        this.deleteBalancingCategoryBtn = document.getElementById('deleteIncomeBtn') as HTMLInputElement;
        this.cancelDeleteCategoryBtn = document.getElementById('cancelDeleteIncomeBtn') as HTMLInputElement;

        this.deleteBalancingCategoryBtn.addEventListener('click', this.deleteCategory.bind(this))
        this.cancelDeleteCategoryBtn.addEventListener('click', this.cancelDeleteCategory.bind(this))


    }

    private async deleteCategory(): Promise<void> {
        const urlParams: URLSearchParams = new URLSearchParams(window.location.search)

        const id: string | null = urlParams.get('id')
        if (!id) {
            return this.openNewRoute('/')
        }
        const result: DefaultResponseType = await HttpUtils.request('/operations/' + id, 'DELETE')
        if (result.redirect) {
            return this.openNewRoute('login')
        }
        if (result.error) {
            // console.log(result.response)
            return alert('Ошибка при удалении категории дохода')
        }
        return this.openNewRoute('/balancing')
    }

    private async cancelDeleteCategory(): Promise<void> {
        await this.openNewRoute('/balancing')
    }
}