import {HttpUtils} from "../../utils/http-utils";
import {PasswordEye} from "../../utils/password-eye";
import {AuthUtils} from "../../utils/auth-utils";
import {SignUpResponseType} from "../../types/sign-up-response.type";
import {SignUpErrorType} from "../../types/sign-up-error.type";
import {LoginResponseType} from "../../types/login-response.type";
import {DefaultResponseType} from "../../types/default-response.type";

export class SignUp {
    readonly openNewRoute: (url: string | null) => Promise<void>
    readonly userNameElement: HTMLInputElement | null
    readonly emailElement: HTMLInputElement | null
    readonly passwordElement: HTMLInputElement | null
    readonly passwordRepeatElement: HTMLInputElement | null

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }


        this.userNameElement = document.getElementById('user-name') as HTMLInputElement;
        this.emailElement = document.getElementById('email') as HTMLInputElement;
        this.passwordElement = document.getElementById('password') as HTMLInputElement;
        this.passwordRepeatElement = document.getElementById('password-repeat') as HTMLInputElement;


        PasswordEye.passwordEye()


        document.getElementById('process-button').addEventListener('click', this.signUp.bind(this));
    }

    private validateForm(): boolean {
        let isValid: boolean = true

        if (this.userNameElement) {
            if (this.userNameElement.value && this.userNameElement.value.match(/^(?:[А-Я][а-я]{2,}(?: [А-Я][а-я]*)*)$/)) {
                this.userNameElement.classList.remove('is-invalid');
            } else {
                this.userNameElement.classList.add('is-invalid');
                isValid = false;
            }
        }
        if (this.emailElement) {
            if (this.emailElement.value && this.emailElement.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
                this.emailElement.classList.remove('is-invalid')
            } else {
                this.emailElement.classList.add('is-invalid')
                isValid = false
            }
        }

        if (this.passwordElement) {
            if (this.passwordElement.value && this.passwordElement.value.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) { // Not fact
                this.passwordElement.classList.remove('is-invalid')
            } else {
                this.passwordElement.classList.add('is-invalid')
                isValid = false
            }
        }
        if (this.passwordRepeatElement && this.passwordElement) {
            if (this.passwordRepeatElement.value && this.passwordElement.value === this.passwordRepeatElement.value) {
                this.passwordRepeatElement.classList.remove('is-invalid')
            } else {
                this.passwordRepeatElement.classList.add('is-invalid')
                isValid = false
            }

        }
        return isValid;
    }

    private async signUp(): Promise<void> {

        if (this.validateForm()) {
            if (this.userNameElement && this.emailElement && this.passwordElement && this.passwordRepeatElement) {
                const result:SignUpResponseType | SignUpErrorType = await HttpUtils.request('/signup', 'POST', false, {
                    name: this.userNameElement.value.split(' ')[1],
                    lastName: this.userNameElement.value.split(' ')[0],
                    email: this.emailElement.value,
                    password: this.passwordElement.value,
                    passwordRepeat: this.passwordRepeatElement.value
                })

                if ((result as SignUpErrorType).error || !(result as SignUpResponseType).response || ((result as SignUpResponseType).response && (!(result as SignUpResponseType).response.user.id || !(result as SignUpResponseType).response.user.email || !(result as SignUpResponseType).response.user.name || !(result as SignUpResponseType).response.user.lastName))) {
                    return
                }

                if ((result as SignUpResponseType).response) {
                    const req: LoginResponseType | DefaultResponseType = await HttpUtils.request('/login', 'POST', false, {
                        email: this.emailElement.value,
                        password: this.passwordElement.value,
                        rememberMe: true
                    })
                    AuthUtils.setAuthInfo((req as LoginResponseType).response.tokens.accessToken, (req as LoginResponseType).response.tokens.refreshToken, {
                        id: (req as LoginResponseType).response.user.id,
                        name: (result as SignUpResponseType).response.user.name,
                        lastName: (req as LoginResponseType).response.user.lastName
                    })

                }
            }

            await this.openNewRoute('/')
        }
    }
}