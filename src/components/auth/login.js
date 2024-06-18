import {Auth} from "../services/auth";
import {HttpUtils} from "../../utils/http-utils";

export class Login {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute

        if (Auth.getAuthInfo(Auth.accessTokenKey)) {
            return this.openNewRoute('/')
        }

        this.emailElement = document.getElementById('email')
        this.passwordElement = document.getElementById('password')
        this.rememberMeElement = document.getElementById('remember-me')
        this.commonErrorElement = document.getElementById('common-error')
        document.getElementById('process-button').addEventListener('click', this.login.bind(this))
    }

    validateForm() {
        let isValid = true
        if (this.emailElement.value && this.emailElement.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
            this.emailElement.classList.remove('is-invalid')
        } else {
            this.emailElement.classList.add('is-invalid')
            isValid = false
        }
        if (this.passwordElement.value) {
            this.passwordElement.classList.remove('is-invalid')
        } else {
            this.passwordElement.classList.add('is-invalid')
            isValid = false
        }

        return isValid
    }

    async login() {
        this.commonErrorElement.style.display = 'none'
        if (this.validateForm()) {
            const result = await HttpUtils.request('/login', 'POST', false,{
                email: this.emailElement.value,
                password: this.passwordElement.value,
                rememberMe: this.rememberMeElement.checked
            })
            console.log(result.error)
            console.log(result.response)
            console.log(!result.response.accessToken)
            console.log(!result.response.refreshToken)
            if (result.error || !result.response || (result.response && (!result.response.tokens.accessToken || !result.response.tokens.refreshToken))) {
                this.commonErrorElement.style.display = 'block'
                return
            }
            Auth.setAuthInfo(result.response.tokens.accessToken, result.response.tokens.refreshToken, {id: result.response.user.id, name: result.response.user.name, lastName: result.response.user.lastName})

            this.openNewRoute('/')

        }
    }
}