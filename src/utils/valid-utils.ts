export function validateLoginForm(emailElement: HTMLInputElement | null, passwordElement: HTMLInputElement | null): boolean {
    let isValid: boolean = true
    if (emailElement) {
        if (emailElement.value && emailElement.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
            emailElement.classList.remove('is-invalid')
        } else {
            emailElement.classList.add('is-invalid')
            isValid = false
        }
    }

    if (passwordElement) {
        if (passwordElement.value && passwordElement.value.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) { // Not fact
            passwordElement.classList.remove('is-invalid')
        } else {
            passwordElement.classList.add('is-invalid')
            isValid = false
        }
    }
    return isValid
}

export function validateSignUpForm(userNameElement: HTMLInputElement | null, emailElement: HTMLInputElement | null, passwordElement: HTMLInputElement | null, passwordRepeatElement: HTMLInputElement | null): boolean {
    let isValid: boolean = true

    if (userNameElement) {
        if (userNameElement.value && userNameElement.value.match(/^(?:[А-Я][а-я]{2,}(?: [А-Я][а-я]*)*)$/)) {
            userNameElement.classList.remove('is-invalid');
        } else {
            userNameElement.classList.add('is-invalid');
            isValid = false;
        }
    }
    if (emailElement) {
        if (emailElement.value && emailElement.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
            emailElement.classList.remove('is-invalid')
        } else {
            emailElement.classList.add('is-invalid')
            isValid = false
        }
    }

    if (passwordElement) {
        if (passwordElement.value && passwordElement.value.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) { // Not fact
            passwordElement.classList.remove('is-invalid')
        } else {
            passwordElement.classList.add('is-invalid')
            isValid = false
        }
    }
    if (passwordElement && passwordRepeatElement) {
        if (passwordRepeatElement.value && passwordElement.value === passwordRepeatElement.value) {
            passwordRepeatElement.classList.remove('is-invalid')
        } else {
            passwordRepeatElement.classList.add('is-invalid')
            isValid = false
        }

    }
    return isValid
}