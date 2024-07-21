
import {HttpUtils} from "../../utils/http-utils";
import {PasswordEye} from "../../utils/password-eye";
import {AuthUtils} from "../../utils/auth-utils";
import {LoginResponseType} from "../../types/login-response.type";
import {DefaultResponseType} from "../../types/default-response.type";
import {OpenNewRouteFunction} from "../../types/open-new-route.type";
import {validateLoginForm} from "../../utils/valid-utils";

export class Login {
    readonly openNewRoute: OpenNewRouteFunction
    readonly emailElement: HTMLInputElement | null
    readonly passwordElement: HTMLInputElement | null
    readonly rememberMeElement: HTMLInputElement | null
    readonly commonErrorElement: HTMLElement | null
    readonly processButtonElement: HTMLInputElement
    constructor(openNewRoute:OpenNewRouteFunction) {
        this.openNewRoute = openNewRoute

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
             this.openNewRoute('/').then()
        }

        this.emailElement = document.getElementById('email') as HTMLInputElement
        this.passwordElement = document.getElementById('password') as HTMLInputElement
        this.rememberMeElement = document.getElementById('remember-me') as HTMLInputElement
        this.commonErrorElement = document.getElementById('common-error')

        PasswordEye.passwordEye()

        this.processButtonElement = document.getElementById('process-button') as HTMLInputElement;
        if(this.processButtonElement){
            this.processButtonElement.addEventListener('click', this.login.bind(this))
        }
    }

    private validateForm(): boolean {
        return validateLoginForm(this.emailElement, this.passwordElement)
    }

    private async login(): Promise<void> {
        if(this.commonErrorElement){
            this.commonErrorElement.style.display = 'none'
        }

        if (this.validateForm()) {
            if (this.emailElement && this.passwordElement && this.emailElement && this.rememberMeElement) {//check if rememberMeElement
                const result: LoginResponseType | DefaultResponseType = await HttpUtils.request('/login', 'POST', false,{
                    email: this.emailElement.value,
                    password: this.passwordElement.value,
                    rememberMe: this.rememberMeElement.checked
                })
                if ((result as DefaultResponseType).error || !(result as LoginResponseType)) {
                    if (this.commonErrorElement){
                        this.commonErrorElement.style.display = 'block'
                    }
                    return
                }
                AuthUtils.setAuthInfo((result as LoginResponseType).tokens.accessToken, (result as LoginResponseType).tokens.refreshToken, {id: (result as LoginResponseType).user.id, name: (result as LoginResponseType).user.name, lastName: (result as LoginResponseType).user.lastName})

                await this.openNewRoute('/')
            }



        }
    }
}