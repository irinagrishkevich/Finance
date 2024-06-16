import {Login} from "./components/auth/login";
import {Main} from "./components/main";
import {SignUp} from "./components/auth/sign-up";
import {Income} from "./components/income";
import {FileUtils} from "./utils/file-utils";

export class Router {
    constructor() {
        this.titleElement = document.getElementById('title')
        this.contentPageElement = document.getElementById('content')

        this.initEvents()


        this.routes = [
            {
                route: '/',
                title: 'Главная',
                template: 'templates/main.html',
                styles: 'style/style.css',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Main()
                },
                scripts: ['chart.umd.js']
            },
            {
                route: '/login',
                title: 'Вход в систему',
                template: 'templates/auth/login.html',
                styles: 'style/style.css',
                useLayout: false,
                load: () => {
                    new Login()
                }
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                template: 'templates/auth/sign-up.html',
                styles: 'style/style.css',
                useLayout: false,
                load: () => {
                    new SignUp()
                }
            },
            {
                route: '/income',
                title: 'Доходы',
                template: 'templates/income/income.html',
                styles: 'style/style.css',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Income()
                }
            },
            {
                route: '/create-income',
                title: 'Создание доходов',
                template: 'templates/income/create-income.html',
                styles: 'style/style.css',
                useLayout: '/templates/layout.html',
                load: () => {

                }
            },
            {
                route: '/edit-income',
                title: 'Редактирование доходов',
                template: 'templates/income/edit-income.html',
                styles: 'style/style.css',
                useLayout: '/templates/layout.html',
                load: () => {

                }
            },
            {
                route: '/expense',
                title: 'Расходы',
                template: 'templates/expense/expense.html',
                styles: 'style/style.css',
                useLayout: '/templates/layout.html',
                load: () => {

                }
            },
            {
                route: '/create-expense',
                title: 'Создание расходов',
                template: 'templates/expense/create-expense.html',
                styles: 'style/style.css',
                useLayout: '/templates/layout.html',
                load: () => {

                }
            },
            {
                route: '/edit-expense',
                title: 'Редактирование расходов',
                template: 'templates/expense/edit-expense.html',
                styles: 'style/style.css',
                useLayout: '/templates/layout.html',
                load: () => {

                }
            },
            {
                route: '/income-and-expense',
                title: 'Доходы и расходы',
                template: 'templates/income-and-expense.html',
                styles: 'style/style.css',
                useLayout: '/templates/layout.html',
                load: () => {

                }
            },
        ]
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this))
        window.addEventListener('popstate', this.activateRoute.bind(this))
        document.addEventListener('click', this.clickHandler.bind(this));
    }

    async openNewRoute(url) {
        const currentRoute = window.location.pathname
        history.pushState({}, '', url)
        await this.activateRoute(null, currentRoute)
    }
    async clickHandler(e) {
        let element = null
        if (e.target.nodeName === 'A') {
            element = e.target
        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode
        }
        if (element) {
            e.preventDefault()
            const currentRoute = window.location.pathname
            const url = element.href.replace(window.location.origin, '')

            if (!url || (currentRoute === url.replace('#submenu1', '')) || url === '/#' || url === '#submenu1' || url.startsWith('javascript:void(0)')) {
                return
            }

            await this.openNewRoute(url)
        }

    }

    async activateRoute(e, oldRoute = null) {
        if (oldRoute){
            const currentRoute = this.routes.find(item => item.route === oldRoute)
            if (currentRoute.scripts && currentRoute.scripts.length > 0) {
                currentRoute.scripts.forEach(script => {
                    document.querySelector(`script[src='/js/${script}']`).remove()
                })
            }
            if (currentRoute.unload && typeof currentRoute.unload === 'function') {
                currentRoute.unload()
            }
        }
        const urlRoute = window.location.pathname
        const newRoute = this.routes.find(item => item.route === urlRoute)
        if (newRoute){
            if (newRoute.scripts && newRoute.scripts.length > 0) {
                for (const script of newRoute.scripts) {
                    await FileUtils.loadPageScript('/js/' + script)
                }
            }
            if (newRoute.title){
                this.titleElement.innerText = newRoute.title + ' | Lumincoin Finance'
            }
            if (newRoute.template){
                let contentBlock = this.contentPageElement
                if (newRoute.useLayout) {
                    this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text())
                    contentBlock = document.getElementById('content-layout')

                    document.body.classList.add('layout-fixed')

                    this.activateMenuItem(newRoute)
                } else {
                    document.body.classList.remove('layout-fixed')
                }
                contentBlock.innerHTML = await fetch(newRoute.template).then(response => response.text())
            }

            if (newRoute.load && typeof newRoute.load === 'function'){
                newRoute.load()
            }
        }else{
            console.log('404')
            await this.activateRoute()
        }
    }
    activateMenuItem(route) {
        document.querySelectorAll('.sidebar .nav-link').forEach(item => {
            const href = item.getAttribute('href')
            if ((route.route.includes(href) && href !== '/') || route.route === '/' && href === '/') {
                item.classList.add('active')
            } else {
                item.classList.remove('active')
            }

        })
    }
}