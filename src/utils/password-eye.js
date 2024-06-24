export class PasswordEye {
    static passwordEye() {
        const buttonsTogglePassword = document.querySelectorAll('.togglePassword');

        const password = document.querySelector('#password');

        buttonsTogglePassword.forEach(togglePassword => {
            togglePassword.addEventListener('click',  (e) => {
                const password = togglePassword.previousElementSibling
                const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
                password.setAttribute('type', type);

                const icon = togglePassword.querySelector('i');
                icon.classList.toggle('bi-eye');
                icon.classList.toggle('bi-eye-slash');
                togglePassword.classList.toggle('active');


                if (type === 'text') {
                    setTimeout(() => {
                        password.setAttribute('type', 'password');
                        icon.classList.toggle('bi-eye');
                        icon.classList.toggle('bi-eye-slash');
                        togglePassword.classList.toggle('active');
                    }, 1000)
                }
            });

        })

    }

}