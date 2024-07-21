import {HttpUtils} from "../../utils/http-utils";
import {PasswordEye} from "../../utils/password-eye";
import {AuthUtils} from "../../utils/auth-utils";
import {SignUpResponseType} from "../../types/sign-up-response.type";
import {SignUpErrorType} from "../../types/sign-up-error.type";
import {LoginResponseType} from "../../types/login-response.type";
import {DefaultResponseType} from "../../types/default-response.type";
import {OpenNewRouteFunction} from "../../types/open-new-route.type";
import {validateSignUpForm} from "../../utils/valid-utils";

export class SignUp {
    readonly openNewRoute: OpenNewRouteFunction
    readonly userNameElement: HTMLInputElement | null
    readonly emailElement: HTMLInputElement
    readonly passwordElement: HTMLInputElement
    readonly passwordRepeatElement: HTMLInputElement
    readonly processButtonElement: HTMLInputElement

    constructor(openNewRoute: OpenNewRouteFunction) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/').then();
        }


        this.userNameElement = document.getElementById('user-name') as HTMLInputElement;
        this.emailElement = document.getElementById('email') as HTMLInputElement;
        this.passwordElement = document.getElementById('password') as HTMLInputElement;
        this.passwordRepeatElement = document.getElementById('password-repeat') as HTMLInputElement;


        PasswordEye.passwordEye()

        this.processButtonElement = document.getElementById('process-button') as HTMLInputElement;
        if(this.processButtonElement){
            this.processButtonElement.addEventListener('click', this.signUp.bind(this));

        }
    }

    private validateForm(): boolean {
        return validateSignUpForm(this.userNameElement, this.emailElement, this.passwordElement, this.passwordRepeatElement)
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

                if ((result as SignUpErrorType).error || !(result as SignUpResponseType) || ((result as SignUpResponseType) && (!(result as SignUpResponseType).user.id || !(result as SignUpResponseType).user.email || !(result as SignUpResponseType).user.name || !(result as SignUpResponseType).user.lastName))) {
                    return
                }

                if ((result as SignUpResponseType)) {
                    const req: LoginResponseType | DefaultResponseType = await HttpUtils.request('/login', 'POST', false, {
                        email: this.emailElement.value,
                        password: this.passwordElement.value,
                        rememberMe: true
                    })
                    AuthUtils.setAuthInfo((req as LoginResponseType).tokens.accessToken, (req as LoginResponseType).tokens.refreshToken, {
                        id: (req as LoginResponseType).user.id,
                        name: (result as SignUpResponseType).user.name,
                        lastName: (req as LoginResponseType).user.lastName
                    })

                }
            }

            await this.openNewRoute('/')
        }
    }
}