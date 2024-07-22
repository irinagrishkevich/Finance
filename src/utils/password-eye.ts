export class PasswordEye {
    public static passwordEye() {
        const buttonsTogglePassword: NodeListOf<HTMLButtonElement> | null = document.querySelectorAll('.togglePassword');

        buttonsTogglePassword.forEach(togglePassword => {
            togglePassword.addEventListener('click',  ():void => {
                const password: HTMLInputElement | null = togglePassword.previousElementSibling as HTMLInputElement
                const type: string = password.getAttribute('type') === 'password' ? 'text' : 'password';
                password.setAttribute('type', type);

                const icon: HTMLElement | null = togglePassword.querySelector('i');
                if (icon) {
                    icon.classList.toggle('bi-eye');
                    icon.classList.toggle('bi-eye-slash');
                }
                togglePassword.classList.toggle('active');


                if (type === 'text') {
                    setTimeout(():void => {
                        password.setAttribute('type', 'password');
                        if (icon){
                            icon.classList.toggle('bi-eye');
                            icon.classList.toggle('bi-eye-slash');
                        }
                        togglePassword.classList.toggle('active');
                    }, 1000)
                }
            });

        })

    }

}