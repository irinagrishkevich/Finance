import {Login} from "./components/auth/login";
import {Main} from "./components/main";
import {SignUp} from "./components/auth/sign-up";

export class Router {
    constructor() {
        this.titleElement = document.getElementById('title')
        this.contentElement = document.getElementById('content')

        this.initEvents()


        this.routers = [
            {
                route: '/',
                title: 'Главная',
                template: 'templates/main.html',
                styles: 'style/style.css',
                load: () => {
                    new Main()
                }
            },
            {
                route: '/login',
                title: 'Вход в систему',
                template: 'templates/auth/login.html',
                styles: 'style/style.css',
                load: () => {
                    new Login()
                }
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                template: 'templates/auth/sign-up.html',
                styles: 'style/style.css',
                load: () => {
                    new SignUp()
                }
            },
        ]
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activeRoute.bind(this))
        window.addEventListener('popstate', this.activeRoute.bind(this))
    }

    async activeRoute(){
        const urlRoute = window.location.pathname
        const newRoute = this.routers.find(item => item.route === urlRoute)
        if (newRoute){
            if (newRoute.title){
                this.titleElement.innerText = newRoute.title + ' | Lumincoin Finance'
            }
            if (newRoute.template){
                this.contentElement.innerHTML = await fetch(newRoute.template).then(response => response.text())
            }

            if (newRoute.load && typeof newRoute.load === 'function'){
                newRoute.load()
            }
        }else{
            console.log('404')
        }
    }

    // async openRoute() {
    //     const urlRoute = window.location.hash.split('?')[0]
    //     if (urlRoute === '#/logout'){
    //         await Auth.logout()
    //         window.location.href = '#/'
    //         return;
    //     }
    //     const newRoute = this.routers.find(item => item.route === urlRoute)
    //
    //     if (!newRoute) {
    //         window.location.href = '#/'
    //         return
    //     }
    //
    //     this.contentElement.innerHTML =
    //         await fetch(newRoute.template).then(response => response.text())
    //     this.stylesElement.setAttribute('href', newRoute.styles)
    //     this.titleElement.innerText = newRoute.title
    //
    //     const userInfo = Auth.getUserInfo()
    //     const accessToken = localStorage.getItem(Auth.accessTokenKey)
    //     if (userInfo && accessToken) {
    //         this.profileElement.style.display = 'flex'
    //         this.profileFullNameElement.innerText= userInfo.fullName
    //     }else {
    //         this.profileElement.style.display = 'none'
    //     }
    //
    //
    //     newRoute.load()
    // }

}