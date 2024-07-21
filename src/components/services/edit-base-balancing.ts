import { HttpUtils } from "../../utils/http-utils";
import { CategoriesIncomeType } from "../../types/categories-income.type";
import { DefaultResponseType } from "../../types/default-response.type";
import { BalancingType } from "../../types/balancing.type";
import { CreateDataType } from "../../types/create-data.type";
import { OpenNewRouteFunction } from "../../types/open-new-route.type";

export abstract class EditBaseBalancing {
    readonly openNewRoute: OpenNewRouteFunction;
    protected typeCategoryName: string | null;
    readonly sumInputElement: HTMLInputElement | null;
    readonly dateInputElement: HTMLInputElement | null;
    readonly commentInputElement: HTMLInputElement | null;
    readonly categorySelectElement: HTMLSelectElement | null;
    readonly typeSelectElement: HTMLSelectElement | null;
    readonly saveButtonElement: HTMLInputElement | null;
    readonly cancelButtonElement: HTMLInputElement | null;
    private categoryElement: HTMLOptionElement | null;
    private operationData: BalancingType | null;

    constructor(openNewRoute: OpenNewRouteFunction) {
        this.openNewRoute = openNewRoute;
        this.typeCategoryName = null;
        this.categoryElement = null;
        this.operationData = null;

        this.typeSelectElement = document.getElementById('typeSelect') as HTMLSelectElement;
        this.categorySelectElement = document.getElementById('categorySelect') as HTMLSelectElement;
        this.sumInputElement = document.getElementById('sumInput') as HTMLInputElement;
        this.dateInputElement = document.getElementById('dateInput') as HTMLInputElement;
        this.commentInputElement = document.getElementById('commentInput') as HTMLInputElement;
        this.saveButtonElement = document.getElementById('saveButton') as HTMLInputElement;
        this.cancelButtonElement = document.getElementById('cancelButton') as HTMLInputElement;

        this.saveButtonElement.addEventListener('click', this.handleSaveClick.bind(this));
        this.cancelButtonElement.addEventListener('click', this.handleCancelClick.bind(this));


        const urlParams: URLSearchParams = new URLSearchParams(window.location.search)
        const id: string | null = urlParams.get('id')
        if (id) {
            this.getOperation(id).then()
        }else {
            this.openNewRoute('/').then()
        }
    }

    private async showCategory(url: string, type: string): Promise<void> {
        const result: CategoriesIncomeType[] | DefaultResponseType = await HttpUtils.request(url);
        (result as CategoriesIncomeType[]).forEach((category): void => {
            this.categoryElement = document.createElement('option');
            this.categoryElement.value = category.id.toString();
            this.categoryElement.innerText = category.title;
            if (this.categorySelectElement) {
                this.categorySelectElement.appendChild(this.categoryElement);
            }
        });
        this.typeCategoryName = type;
    }

    private async getOperation(id: string): Promise<void> {
        const result: DefaultResponseType | BalancingType = await HttpUtils.request('/operations/' + id);
        if ((result as DefaultResponseType).redirect) {
            return this.openNewRoute('/login');
        }
        if ((result as DefaultResponseType).error || !(result as BalancingType)) {
            console.log("Ошибка при запросе операции");
            return;
        }
        this.operationData = result as BalancingType;
        this.showOperation();
    }

    private showOperation(): void {
        if (this.operationData) {
            if (this.categorySelectElement) {
                this.categorySelectElement.value = this.operationData.category;
                this.categorySelectElement.setAttribute('selected', 'selected');
            }
            this.showCategory(this.getCategoryUrl(), this.getCategoryType()).then();
            if (this.sumInputElement) {
                this.sumInputElement.value = this.operationData.amount.toString();
            }
            if (this.dateInputElement) {
                this.dateInputElement.value = this.operationData.date;
            }
            if (this.commentInputElement) {
                this.commentInputElement.value = this.operationData.comment;
            }
            if (this.typeSelectElement) {
                this.typeSelectElement.addEventListener('change', async (e: Event) => {
                    if ((e.target as HTMLSelectElement).value === this.getAlternateTypeValue()) {
                        await this.showAlternateCategory();
                    }
                });
            }
        }
    }

    private validateField(): boolean {
        let isValid = true;
        if (this.sumInputElement) {
            if (this.sumInputElement.value && parseInt(this.sumInputElement.value) > 0) {
                this.sumInputElement.classList.remove('is-invalid');
            } else {
                this.sumInputElement.classList.add('is-invalid');
                isValid = false;
            }
        }
        if (this.dateInputElement) {
            if (this.dateInputElement.value) {
                this.dateInputElement.classList.remove('is-invalid');
            } else {
                this.dateInputElement.classList.add('is-invalid');
                isValid = false;
            }
        }
        if (this.commentInputElement) {
            if (this.commentInputElement.value) {
                this.commentInputElement.classList.remove('is-invalid');
            } else {
                this.commentInputElement.classList.add('is-invalid');
                isValid = false;
            }
        }
        return isValid;
    }

    private async handleSaveClick(e: Event): Promise<void> {
        e.preventDefault();
        if (this.validateField()) {
            const changedData: CreateDataType | null = {
                type: this.typeCategoryName!,
                amount: parseInt(this.sumInputElement!.value),
                date: this.dateInputElement!.value,
                comment: this.commentInputElement!.value,
                category_id: parseInt(this.categorySelectElement!.value),
            };
            if (changedData && this.operationData) {
                const result: BalancingType | DefaultResponseType = await HttpUtils.request('/operations/' + this.operationData.id, 'PUT', true, changedData);
                if ((result as DefaultResponseType).redirect) {
                    return this.openNewRoute('/login');
                }
                if ((result as DefaultResponseType).error) {
                    console.log((result as DefaultResponseType).error);
                    return alert('Ошибка при редактировании операции');
                }
            }
            await this.openNewRoute('/balancing');
        }
    }

    private async handleCancelClick(): Promise<void> {
        await this.openNewRoute('/balancing');
    }

    protected abstract getCategoryUrl(): string;
    protected abstract getCategoryType(): string;
    protected abstract getAlternateTypeValue(): string;
    protected abstract showAlternateCategory(): Promise<void>;
}
