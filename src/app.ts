import {Router} from "./router";

class App {
    private router: Router; // delete
    constructor() {
        this.router = new Router() // only new Router() in constructor
    }
}

(new App())
