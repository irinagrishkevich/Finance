import {HttpUtils} from "../utils/http-utils";
import {AuthUtils} from "../utils/auth-utils";
import config from "../config/config";

export class Layout {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.burgerTabElement = document.getElementById('burgerTab')
        this.burgerMenuElement = document.getElementById('burgerMenu')
        this.burgerElement = document.getElementById('burger')
        this.userIconElement = document.getElementById('userIcon')
        this.userMenuElement = document.getElementById('userMenu')
        this.logoutButtonElement = document.getElementById('logout')
        this.balanceElement = document.getElementById('balance')
        this.balanceModalElement = document.getElementById('balanceModal')
        this.balanceInputElement = document.getElementById('balanceInput')
        this.saveBalanceButtonElement = document.getElementById('saveBalanceButton')

        this.initEvent()
    }

    initEvent() {
        this.addBurgerMenuEventListener()
        this.userIconElement.addEventListener('click', this.toggleUserMenu.bind(this))
        this.outsideClick = this.handleOutsideClick.bind(this)

        this.balanceElement.addEventListener('click', this.balanceClickHandler.bind(this));
        this.saveBalanceButtonElement.addEventListener('click', this.saveBalance.bind(this));

        window.addEventListener('click', (event) => {
            if (event.target === this.balanceModalElement ) {
                this.closeModal();
            }
        });

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
        }
    }

    toggleUserMenu() {
        if (this.userMenuElement) {
            const isOpen = this.userMenuElement.classList.contains('d-flex')
            if (isOpen) {
                this.closeUserMenu()
            } else {
                this.userMenuElement.classList.add('d-block')
                this.userMenuElement.classList.remove('d-none')

                document.addEventListener('click', this.outsideClick);
                this.logoutButtonElement.addEventListener('click', () => {
                    this.closeUserMenu()
                });
            }
        }
    }
    closeUserMenu() {
        this.userMenuElement.classList.remove('d-block')
        this.userMenuElement.classList.add('d-none')
        document.removeEventListener('click', this.outsideClick);
    }

    handleOutsideClick(event) {
        if (!this.userIconElement.contains(event.target) && !this.userMenuElement.contains(event.target)) {
            this.closeUserMenu()
        }
    }

    async getBalance() {
        const result = await HttpUtils.request('/balance')
        if (result.redirect) {
            this.openNewRoute(result.redirect);
        }

        this.balanceElement.innerText = ' ' + result.response.balance + ' $'
    }

    async balanceClickHandler(event) {
        this.balanceModalElement.classList.toggle('d-none')
        this.saveBalanceButtonElement.addEventListener('click', () => this.closeModal());
    }

    closeModal() {
        this.balanceModalElement.classList.add('d-none')
    }

    async saveBalance() {
        const result = await HttpUtils.request('/balance', 'PUT', true, {newBalance: this.balanceInputElement.value})
        if (result.error) {
            return
        }
        this.balanceElement.innerText = ' ' + result.response.balance + ' $'
        this.closeModal()
    }
}