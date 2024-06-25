import {Login} from "./components/auth/login";
import {Main} from "./components/main";
import {SignUp} from "./components/auth/sign-up";
import {Income} from "./components/income/income";
import {FileUtils} from "./utils/file-utils";
import {Layout} from "./components/layout";
import {PasswordEye} from "./utils/password-eye";
import {Logout} from "./components/auth/logout";
import {AuthUtils} from "./utils/auth-utils";
import {IncomeCreate} from "./components/income/create";
import {IncomeEdit} from "./components/income/edit";
import {DeleteIncome} from "./components/income/delete";
import {Expense} from "./components/expense/expense";
import {ExpenseCreate} from "./components/expense/create";
import {ExpenseEdit} from "./components/expense/edit";
import {DeleteExpense} from "./components/expense/delete";
import {Balancing} from "./components/balancing/balancing";
import {CreateIncomeBalancing} from "./components/balancing/create-income";
import {CreateExpenseBalancing} from "./components/balancing/create-expense";


export class Router {
    constructor() {
        this.titleElement = document.getElementById('title')
        this.contentPageElement = document.getElementById('content')

        this.initEvents()


        this.routes = [
            {
                route: '/',
                title: 'Главная',
                template: '/templates/main.html',
                styles: '/style/style.css',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Main()

                },
                scripts: ['chart.umd.js']
            },
            {
                route: '/login',
                title: 'Вход в систему',
                template: '/templates/auth/login.html',
                styles: '/style/style.css',
                useLayout: false,
                load: () => {
                    new Login(this.openNewRoute.bind(this))
                    new PasswordEye()
                }
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                template: '/templates/auth/sign-up.html',
                styles: '/style/style.css',
                useLayout: false,
                load: () => {
                    new SignUp(this.openNewRoute.bind(this))
                }
            },
            {
                route: '/logout',
                load: () => {
                    new Logout(this.openNewRoute.bind(this))
                }
            },
            {
                route: '/income',
                title: 'Доходы',
                template: '/templates/income/income.html',
                styles: '/style/style.css',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Income(this.openNewRoute.bind(this))
                }
            },
            {
                route: '/income/create',
                title: 'Создание доходов',
                template: '/templates/income/create.html',
                styles: '/style/style.css',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeCreate(this.openNewRoute.bind(this))
                }
            },
            {
                route: '/income/edit',
                title: 'Редактирование доходов',
                template: '/templates/income/edit.html',
                styles: '/style/style.css',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeEdit(this.openNewRoute.bind(this))
                }
            },
            {
                route: '/income/delete',
                load: () => {
                    new DeleteIncome(this.openNewRoute.bind(this))
                }
            },
            {
                route: '/expense',
                title: 'Расходы',
                template: '/templates/expense/expense.html',
                styles: '/style/style.css',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Expense(this.openNewRoute.bind(this))
                }
            },
            {
                route: '/expense/create',
                title: 'Создание расходов',
                template: '/templates/expense/create.html',
                styles: '/style/style.css',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpenseCreate(this.openNewRoute.bind(this))
                }
            },
            {
                route: '/expense/edit',
                title: 'Редактирование расходов',
                template: '/templates/expense/edit.html',
                styles: '/style/style.css',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpenseEdit(this.openNewRoute.bind(this))
                }
            },
            {
                route: '/expense/delete',
                load: () => {
                    new DeleteExpense(this.openNewRoute.bind(this))
                }
            },
            {
                route: '/balancing',
                title: 'Доходы и расходы',
                template: '/templates/balancing/balancing.html',
                styles: '/style/style.css',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Balancing(this.openNewRoute.bind(this))
                }
            },
            {
                route: '/balancing/create-income',
                title: 'Создание дохода',
                template: '/templates/balancing/income-create.html',
                styles: '/style/style.css',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CreateIncomeBalancing(this.openNewRoute.bind(this))
                }
            },
            {
                route: '/balancing/edit-income',
                title: 'Редактирование дохода',
                template: '/templates//balancing/income-edit.html',
                styles: '/style/style.css',
                useLayout: '/templates/layout.html',
                load: () => {

                }
            },
            {
                route: '/balancing/create-expense',
                title: 'Создание расхода',
                template: '/templates/balancing/expense-create.html',
                styles: '/style/style.css',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CreateExpenseBalancing(this.openNewRoute.bind(this))
                }
            },
            {
                route: '/balancing/edit-expense',
                title: 'Редактирование расхода',
                template: '/templates/balancing/expense-edit.html',
                styles: '/style/style.css',
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
        if (oldRoute) {
            const currentRoute = this.routes.find(item => item.route === oldRoute)

            if (currentRoute.scripts && currentRoute.scripts.length > 0) {
                currentRoute.scripts.forEach(script => {
                    document.querySelector(`script[src='/js/${script}']`).remove()
                })
            }
        }
        const urlRoute = window.location.pathname
        const newRoute = this.routes.find(item => item.route === urlRoute)


        if (newRoute) {
            if (newRoute.scripts && newRoute.scripts.length > 0) {
                for (const script of newRoute.scripts) {
                    await FileUtils.loadPageScript('/js/' + script)
                }
            }
            if (newRoute.title) {
                this.titleElement.innerText = newRoute.title + ' | Lumincoin Finance'
            }
            if (newRoute.template) {
                let contentBlock = this.contentPageElement
                if (newRoute.useLayout) {
                    this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text())
                    contentBlock = document.getElementById('content-layout')
                    new Layout(this.openNewRoute.bind(this))
                    this.profileNameElement = document.getElementById('profileName')
                    if (!this.userName) {
                        let userInfo = AuthUtils.getAuthInfo(AuthUtils.userInfoKey)

                        if (userInfo) {
                            userInfo = JSON.parse(userInfo)
                            if (userInfo && userInfo.name) {
                                this.userName = userInfo.name + ' ' + userInfo.lastName
                            }
                        } else {
                            console.log('no user info')

                        }
                    }
                    this.profileNameElement.innerText = this.userName
                    this.activateMenuItem(newRoute)
                }
                contentBlock.innerHTML = await fetch(newRoute.template).then(response => response.text())

            }

            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load()
            }
        } else {
            console.log('404')
            alert('404')
            return
        }

    }

    activateMenuItem(route) {

        document.querySelectorAll('.nav-link').forEach(item => {
            const href = item.getAttribute('href');
            if ((route.route.includes(href) && href !== '/') || route.route === '/' && href === '/') {
                item.classList.add('active', 'text-white');
            } else {
                item.classList.remove('active', 'text-white');
            }
        });

        const categoryLink = document.querySelector('a[href="#submenu1"]');
        const submenu = document.getElementById('submenu1');
        categoryLink.addEventListener('click', () => {
            categoryLink.classList.toggle('active')
            categoryLink.classList.toggle('text-white');

        })
        if (route.route.includes('/income') || route.route.includes('/expense')) {
            submenu.classList.add('show')
            categoryLink.classList.add('active', 'text-white')
            document.querySelectorAll('#submenu1 .nav-link').forEach(subItem => {
                const subHref = subItem.getAttribute('href');
                if (route.route.includes(subHref)) {
                    subItem.classList.add('active', 'text-white');
                } else {
                    subItem.classList.remove('active', 'text-white');
                }
            });
        } else {
            categoryLink.classList.remove('active', 'text-white');
            submenu.classList.remove('show');
        }
    }

}