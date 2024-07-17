
import {HttpUtils} from "../../utils/http-utils";
import {PasswordEye} from "../../utils/password-eye";
import {AuthUtils} from "../../utils/auth-utils";
import {LoginResponseType} from "../../types/login-response.type";
import {DefaultResponseType} from "../../types/default-response.type";

export class Login {
    readonly openNewRoute: (url: string | null) => Promise<void>
    readonly emailElement: HTMLInputElement | null
    readonly passwordElement: HTMLInputElement | null
    readonly rememberMeElement: HTMLInputElement | null
    readonly commonErrorElement: HTMLElement | null
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/')
        }

        this.emailElement = document.getElementById('email') as HTMLInputElement
        this.passwordElement = document.getElementById('password') as HTMLInputElement
        this.rememberMeElement = document.getElementById('remember-me') as HTMLInputElement
        this.commonErrorElement = document.getElementById('common-error')

        PasswordEye.passwordEye()

        document.getElementById('process-button').addEventListener('click', this.login.bind(this))
    }

    private validateForm(): boolean {
        let isValid: boolean = true
        if (this.emailElement){
            if (this.emailElement.value && this.emailElement.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
                this.emailElement.classList.remove('is-invalid')
            } else {
                this.emailElement.classList.add('is-invalid')
                isValid = false
            }
        }

        if (this.passwordElement){
            if (this.passwordElement.value) {
                this.passwordElement.classList.remove('is-invalid')
            } else {
                this.passwordElement.classList.add('is-invalid')
                isValid = false
            }
        }
        return isValid
    }

    private async login(): Promise<void> {
        this.commonErrorElement.style.display = 'none'
        if (this.validateForm()) {
            if (this.emailElement && this.passwordElement && this.emailElement && this.rememberMeElement) {//check if rememberMeElement
                const result: LoginResponseType | DefaultResponseType = await HttpUtils.request('/login', 'POST', false,{
                    email: this.emailElement.value,
                    password: this.passwordElement.value,
                    rememberMe: this.rememberMeElement.checked
                })
                if ((result as DefaultResponseType).error || !((result as LoginResponseType).response || (result as LoginResponseType).response)) {
                    if (this.commonErrorElement){
                        this.commonErrorElement.style.display = 'block'
                    }
                    return
                }
                AuthUtils.setAuthInfo((result as LoginResponseType).response.tokens.accessToken, (result as LoginResponseType).response.tokens.refreshToken, {id: (result as LoginResponseType).response.user.id, name: (result as LoginResponseType).response.user.name, lastName: (result as LoginResponseType).response.user.lastName})

                await this.openNewRoute('/')
            }



        }
    }
}