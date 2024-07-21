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
import {EditIncomeBalancing} from "./components/balancing/edit-income";
import {EditExpenseBalancing} from "./components/balancing/edit-expense";
import {DeleteBalancingOperation} from "./components/balancing/delete";
import {RouteType} from "./types/route.type";
import {UserInfo} from "./types/user-info.type";


export class Router {
    readonly titleElement: HTMLElement | null;
    readonly contentPageElement: HTMLElement | null;
    private profileNameElement: HTMLElement | null;
    private userName: string | null;
    private routes: RouteType[] = []

    constructor() {
        this.titleElement = document.getElementById('title')
        this.contentPageElement = document.getElementById('content')
        this.profileNameElement = null
        this.userName = null

        this.initEvents()


        this.routes = [
            {
                route: '/',
                title: 'Главная',
                template: '/templates/main.html',
                styles: '/style/style.css',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Main(this.openNewRoute.bind(this))

                },
                scripts: ['chart.umd.js']
            },
            {
                route: '/login',
                title: 'Вход в систему',
                template: '/templates/auth/login.html',
                styles: '/style/style.css',
                // useLayout: false,
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
                // useLayout: false,
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
                template: '/templates/balancing/income-edit.html',
                styles: '/style/style.css',
                useLayout: '/templates/layout.html',
                load: () => {
                    new EditIncomeBalancing(this.openNewRoute.bind(this))
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
                    new EditExpenseBalancing(this.openNewRoute.bind(this))
                }
            },
            {
                route: '/balancing/delete',
                load: () => {
                    new DeleteBalancingOperation(this.openNewRoute.bind(this))
                }
            }
        ]
    }

    private initEvents(): void {

        document.addEventListener('click', this.clickHandler.bind(this));

    }


    public async openNewRoute(url: string | null): Promise<void> {
        if (url) {
            const currentRoute: string = window.location.pathname
            history.pushState({}, '', url)
            await this.activateRoute(null, currentRoute)
        }
    }

    public async clickHandler(e: Event | null): Promise<void> {
        if (!e) return
        let element: HTMLAnchorElement | null = null

        const target: HTMLElement = e.target as HTMLElement
        if (target.nodeName === 'A') {
            element = target as HTMLAnchorElement
        } else if (target.parentNode && (target.parentNode as HTMLElement).nodeName === 'A') {
            element = target.parentNode as HTMLAnchorElement
        }
        if (element) {
            e.preventDefault()
            const currentRoute: string | null = window.location.pathname
            const url: string = element.href.replace(window.location.origin, '')

            if (!url || (currentRoute === url.replace('#submenu1', '')) || url === '/#' || url === '#submenu1' || url.startsWith('javascript:void(0)')) {
                return
            }

            await this.openNewRoute(url)
        }

    }

    private async activateRoute(e: Event | null, oldRoute: string | null = null): Promise<void> {
        if (oldRoute) {
            const currentRoute: RouteType | undefined = this.routes.find(item => item.route === oldRoute)
            if (currentRoute !== undefined && currentRoute.scripts) {
                if ((currentRoute as RouteType).scripts && currentRoute.scripts.length > 0) {
                    currentRoute.scripts.forEach((script: string): void => {
                        const scriptElement: HTMLScriptElement | null = document.querySelector(`script[src='/js/${script}']`)
                        if (scriptElement) {
                            scriptElement.remove()
                        }
                    })

                }
            }
        }
        const urlRoute: string | null = window.location.pathname
        const newRoute: RouteType | undefined = this.routes.find(item => item.route === urlRoute)


        if (newRoute) {
            if (newRoute.scripts && newRoute.scripts.length > 0) {
                for (const script of newRoute.scripts) {
                    await FileUtils.loadPageScript('/js/' + script)
                }
            }
            if (newRoute.title) {
                if (this.titleElement) {
                    this.titleElement.innerText = newRoute.title + ' | Lumincoin Finance'
                }
            }
            if (newRoute.template) {
                let contentBlock: HTMLElement | null = this.contentPageElement
                if (newRoute.useLayout) {
                    if (this.contentPageElement) {
                        this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text())
                        contentBlock = document.getElementById('content-layout')
                        new Layout(this.openNewRoute.bind(this))
                        this.profileNameElement = document.getElementById('profileName')
                        console.log(this.userName)
                        console.log(!this.userName)
                        if (!this.userName || AuthUtils.getAuthInfo(AuthUtils.userInfoKey)) {

                            let userInfoString: string = AuthUtils.getAuthInfo(AuthUtils.userInfoKey) as string
                            let userInfo: UserInfo | null = null

                            if (userInfoString) {
                                userInfo = JSON.parse(userInfoString) as UserInfo
                                if (userInfo && userInfo.name) {
                                    this.userName = `${userInfo.name} ${userInfo.lastName}`
                                }
                            } else {
                                console.log('no user info')

                            }
                            console.log(this.userName)
                            if (this.profileNameElement && this.userName) {
                                console.log(this.userName)
                                this.profileNameElement.innerText = this.userName
                            }

                        }


                        this.activateMenuItem(newRoute)
                    }
                }
                if (contentBlock) {
                    contentBlock.innerHTML = await fetch(newRoute.template).then(response => response.text())
                }
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

    private activateMenuItem(route: RouteType): void {
        let menuLinks: NodeListOf<Element> = document.querySelectorAll('.nav-link')
        menuLinks.forEach(item => {
            const href: string | null = item.getAttribute('href');
            if (href) {
                if ((route.route.includes(href) && href !== '/') || route.route === '/' && href === '/') {
                    item.classList.add('active', 'text-white');
                } else {
                    item.classList.remove('active', 'text-white');
                }
            }
        });

        const categoryLink: HTMLInputElement | null = document.querySelector('a[href="#submenu1"]');
        const submenu: HTMLInputElement | null = document.getElementById('submenu1') as HTMLInputElement;
        if (categoryLink) {
            categoryLink.addEventListener('click', () => {
                categoryLink.classList.toggle('active')
                categoryLink.classList.toggle('text-white');
            })
        }
        if (route.route.includes('/income') || route.route.includes('/expense')) {
            submenu.classList.add('show')
            if (categoryLink) {
                categoryLink.classList.add('active', 'text-white')
            }
            let submenuLinks: NodeListOf<Element> = document.querySelectorAll('#submenu1 .nav-link')
            if (submenuLinks) {
                submenuLinks.forEach(subItem => {
                    const subHref: string | null = subItem.getAttribute('href');
                    if (subHref) {
                        if (route.route.includes(subHref)) {
                            subItem.classList.add('active', 'text-white');
                        } else {
                            subItem.classList.remove('active', 'text-white');
                        }

                    }
                });
            }
        } else {
            if (categoryLink) {
                categoryLink.classList.remove('active', 'text-white');
            }
            submenu.classList.remove('show');
        }
    }

}