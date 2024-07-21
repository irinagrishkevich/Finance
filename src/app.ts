import {Router} from "./router";

class App {
    private router: Router; // delete
    constructor() {
        this.router = new Router()
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this))
        window.addEventListener('popstate', this.activateRoute.bind(this))
// only new Router() in constructor
    }
    private activateRoute(e: Event | null): void {
        this.router.clickHandler(e).then()
    }
}

(new App())
