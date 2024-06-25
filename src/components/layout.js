import {HttpUtils} from "../utils/http-utils";
import {AuthUtils} from "../utils/auth-utils";
import config from "../config/config";

export class Layout {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.burgerTabElement = document.getElementById('burgerTab')
        this.burgerMenuElement = document.getElementById('burgerMenu')
        this.burgerElement = document.getElementById('burger')
        this.balanceElement = document.getElementById('balance')
        this.balanceBlockElement = document.getElementById('balanceBlock')
        this.profileElement = document.getElementById('profile')
        this.balanceInputElement = document.getElementById('balanceInput')
        this.saveBalanceButtonElement = document.getElementById('saveBalanceButton')

        this.initEvent()
    }

    initEvent() {
        this.addBurgerMenuEventListener()
        this.saveBalanceButtonElement.addEventListener('click', this.saveBalance.bind(this));

        this.getBalance().then()
    }

    addBurgerMenuEventListener() {
        if (this.burgerMenuElement && this.burgerTabElement) {
            this.burgerTabElement.addEventListener('click', this.toggleBurgerMenu.bind(this))
        }
    }

    toggleBurgerMenu() {
        if (this.burgerMenuElement) {
            this.burgerMenuElement.classList.toggle('d-none')
            this.burgerElement.classList.toggle('open')
            this.balanceBlockElement.classList.toggle('d-none')
            this.profileElement.classList.toggle('d-none')
        }
    }

    async getBalance() {
        const result = await HttpUtils.request('/balance')
        if (result.redirect) {
            this.openNewRoute(result.redirect);
        }

        this.balanceElement.innerText = ' ' + result.response.balance + ' $'
    }

    async saveBalance() {
        const result = await HttpUtils.request('/balance', 'PUT', true, {newBalance: this.balanceInputElement.value})
        if (result.error) {
            return
        }
        this.balanceElement.innerText = ' ' + result.response.balance + ' $'
    }
}