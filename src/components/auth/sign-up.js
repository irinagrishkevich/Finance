
import {HttpUtils} from "../../utils/http-utils";
import {PasswordEye} from "../../utils/password-eye";
import {AuthUtils} from "../../utils/auth-utils";

export class SignUp {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }


        this.userNameElement = document.getElementById('user-name');
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.passwordRepeatElement = document.getElementById('password-repeat');


        PasswordEye.passwordEye()


        document.getElementById('process-button').addEventListener('click', this.signUp.bind(this));
    }

    validateForm() {
        let isValid = true

        if (this.userNameElement.value && this.userNameElement.value.match(/^(?:[А-Я][а-я]{2,}(?: [А-Я][а-я]*)*)$/)) {
            this.userNameElement.classList.remove('is-invalid');
        } else {
            this.userNameElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.emailElement.value && this.emailElement.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
            this.emailElement.classList.remove('is-invalid')
        } else {
            this.emailElement.classList.add('is-invalid')
            isValid = false
        }


        if (this.passwordElement.value && this.passwordElement.value.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) { // Not fact
            this.passwordElement.classList.remove('is-invalid')
        } else {
            this.passwordElement.classList.add('is-invalid')
            isValid = false
        }

        if (this.passwordRepeatElement.value && this.passwordElement.value === this.passwordRepeatElement.value) {
            this.passwordRepeatElement.classList.remove('is-invalid')
        } else {
            this.passwordRepeatElement.classList.add('is-invalid')
            isValid = false
        }

        return isValid;
    }

    async signUp() {

        if (this.validateForm()) {
            const result = await HttpUtils.request('/signup', 'POST', false, {
                name: this.userNameElement.value.split(' ')[1],
                lastName: this.userNameElement.value.split(' ')[0],
                email: this.emailElement.value,
                password: this.passwordElement.value,
                passwordRepeat: this.passwordRepeatElement.value
            })

            if (result.error || !result.response || (result.response && (!result.response.user.id || !result.response.user.email || !result.response.user.name || !result.response.user.lastName))) {
                return
            }
            this.openNewRoute('/login')
        }
    }
}