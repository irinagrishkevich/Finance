import {HttpUtils} from "../utils/http-utils";
import {BalanceResponseType} from "../types/balance-response.type";
import {DefaultResponseType} from "../types/default-response.type";
import {OpenNewRouteFunction} from "../types/open-new-route.type";
import {AuthUtils} from "../utils/auth-utils";


export class Layout {
    readonly openNewRoute: OpenNewRouteFunction
    readonly burgerTabElement: HTMLElement | null
    readonly burgerMenuElement: HTMLElement | null
    readonly burgerElement: HTMLElement | null
    readonly balanceElement: HTMLElement | null
    readonly balanceBlockElement: HTMLElement | null
    readonly profileElement: HTMLElement | null
    readonly balanceInputElement: HTMLInputElement | null
    readonly saveBalanceButtonElement: HTMLElement | null

    constructor(openNewRoute:OpenNewRouteFunction) {
        this.openNewRoute = openNewRoute;
        this.burgerTabElement = document.getElementById('burgerTab')
        this.burgerMenuElement = document.getElementById('burgerMenu')
        this.burgerElement = document.getElementById('burger')
        this.balanceElement = document.getElementById('balance')
        this.balanceBlockElement = document.getElementById('balanceBlock')
        this.profileElement = document.getElementById('profile')
        this.balanceInputElement = document.getElementById('balanceInput') as HTMLInputElement
        this.saveBalanceButtonElement = document.getElementById('saveBalanceButton')

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login').then()
            return
        }

        this.initEvent()
    }

    private initEvent(): void {
        this.addBurgerMenuEventListener()
        if (this.saveBalanceButtonElement) {
            this.saveBalanceButtonElement.addEventListener('click', this.saveBalance.bind(this));

        }
        this.getBalance().then()
    }

    private addBurgerMenuEventListener(): void {
        if (this.burgerMenuElement && this.burgerTabElement) {
            this.burgerTabElement.addEventListener('click', this.toggleBurgerMenu.bind(this))
        }
    }

    private toggleBurgerMenu(): void {
        if (this.burgerMenuElement) {
            this.burgerMenuElement.classList.toggle('d-none')
            if (this.burgerElement) {
                this.burgerElement.classList.toggle('open')
            }
            if (this.balanceBlockElement) {
                this.balanceBlockElement.classList.toggle('d-none')
            }
            if (this.profileElement) {
                this.profileElement.classList.toggle('d-none')
            }
        }
    }

    private async getBalance(): Promise<void> {
        const result: BalanceResponseType | DefaultResponseType = await HttpUtils.request('/balance')
        if ((result as DefaultResponseType).redirect) {
            await this.openNewRoute('/login');
        }
        if ((result as DefaultResponseType).error) {
            console.log((result as DefaultResponseType).error)
        }
        if (this.balanceElement) {
            this.balanceElement.innerText = ' ' + (result as BalanceResponseType).balance + ' $'

        }
    }

    private async saveBalance(): Promise<void> {
        if (this.balanceInputElement) {
            const result: BalanceResponseType | DefaultResponseType = await HttpUtils.request('/balance', 'PUT', true, {newBalance: this.balanceInputElement.value})
            if ((result as DefaultResponseType).error) {
                console.log((result as DefaultResponseType).error)
            }

            if (this.balanceElement) {
                this.balanceElement.innerText = ' ' + (result as BalanceResponseType).balance + ' $'

            }
        }
    }
}