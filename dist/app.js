/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.js":
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _router_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./router.js */ \"./src/router.js\");\n\n\nclass App {\n    constructor() {\n        new _router_js__WEBPACK_IMPORTED_MODULE_0__.Router()\n    }\n}\n\n(new App())\n\n\n//# sourceURL=webpack://frontend/./src/app.js?");

/***/ }),

/***/ "./src/components/auth/login.js":
/*!**************************************!*\
  !*** ./src/components/auth/login.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Login: () => (/* binding */ Login)\n/* harmony export */ });\nclass Login{\n    constructor(){\n        console.log('login')\n    }\n}\n\n//# sourceURL=webpack://frontend/./src/components/auth/login.js?");

/***/ }),

/***/ "./src/components/auth/sign-up.js":
/*!****************************************!*\
  !*** ./src/components/auth/sign-up.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   SignUp: () => (/* binding */ SignUp)\n/* harmony export */ });\nclass SignUp{\n    constructor(){\n        console.log('SignUp')\n    }\n}\n\n//# sourceURL=webpack://frontend/./src/components/auth/sign-up.js?");

/***/ }),

/***/ "./src/components/income.js":
/*!**********************************!*\
  !*** ./src/components/income.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Income: () => (/* binding */ Income)\n/* harmony export */ });\nclass Income{\n    constructor(){\n        console.log('income')\n    }\n}\n\n//# sourceURL=webpack://frontend/./src/components/income.js?");

/***/ }),

/***/ "./src/components/main.js":
/*!********************************!*\
  !*** ./src/components/main.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Main: () => (/* binding */ Main)\n/* harmony export */ });\nclass Main{\n    constructor(){\n        console.log('main')\n    }\n}\n\n//# sourceURL=webpack://frontend/./src/components/main.js?");

/***/ }),

/***/ "./src/router.js":
/*!***********************!*\
  !*** ./src/router.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Router: () => (/* binding */ Router)\n/* harmony export */ });\n/* harmony import */ var _components_auth_login__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/auth/login */ \"./src/components/auth/login.js\");\n/* harmony import */ var _components_main__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/main */ \"./src/components/main.js\");\n/* harmony import */ var _components_auth_sign_up__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/auth/sign-up */ \"./src/components/auth/sign-up.js\");\n/* harmony import */ var _components_income__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/income */ \"./src/components/income.js\");\n/* harmony import */ var _utils_file_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/file-utils */ \"./src/utils/file-utils.js\");\n\n\n\n\n\n\nclass Router {\n    constructor() {\n        this.titleElement = document.getElementById('title')\n        this.contentPageElement = document.getElementById('content')\n\n        this.initEvents()\n\n\n        this.routers = [\n            {\n                route: '/',\n                title: 'Главная',\n                template: 'templates/main.html',\n                styles: 'style/style.css',\n                useLayout: '/templates/layout.html',\n                load: () => {\n                    new _components_main__WEBPACK_IMPORTED_MODULE_1__.Main()\n                },\n                scripts: ['chart.js']\n            },\n            {\n                route: '/login',\n                title: 'Вход в систему',\n                template: 'templates/auth/login.html',\n                styles: 'style/style.css',\n                useLayout: false,\n                load: () => {\n                    new _components_auth_login__WEBPACK_IMPORTED_MODULE_0__.Login()\n                }\n            },\n            {\n                route: '/sign-up',\n                title: 'Регистрация',\n                template: 'templates/auth/sign-up.html',\n                styles: 'style/style.css',\n                useLayout: false,\n                load: () => {\n                    new _components_auth_sign_up__WEBPACK_IMPORTED_MODULE_2__.SignUp()\n                }\n            },\n            {\n                route: '/income',\n                title: 'Доходы',\n                template: 'templates/income.html',\n                styles: 'style/style.css',\n                useLayout: '/templates/layout.html',\n                load: () => {\n                    new _components_income__WEBPACK_IMPORTED_MODULE_3__.Income()\n                }\n            },\n        ]\n    }\n\n    initEvents() {\n        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this))\n        window.addEventListener('popstate', this.activateRoute.bind(this))\n        document.addEventListener('click', this.clickHandler.bind(this));\n    }\n\n    async openNewRoute(url) {\n        const currentRoute = window.location.pathname\n        history.pushState({}, '', url)\n        await this.activateRoute(null, currentRoute)\n    }\n    async clickHandler(e) {\n        let element = null\n        if (e.target.nodeName === 'A') {\n            element = e.target\n        } else if (e.target.parentNode.nodeName === 'A') {\n            element = e.target.parentNode\n        }\n        if (element) {\n            e.preventDefault()\n            const currentRoute = window.location.pathname\n            const url = element.href.replace(window.location.origin, '')\n\n            if (!url || (currentRoute === url.replace('#', '')) || url === '/#' || url.startsWith('javascript:void(0)')) {\n                return\n            }\n\n            await this.openNewRoute(url)\n        }\n\n    }\n\n    async activateRoute(e, oldRoute = null) {\n        if (oldRoute){\n            const currentRoute = this.routes.find(item => item.route === oldRoute)\n            if (currentRoute.scripts && currentRoute.scripts.length > 0) {\n                currentRoute.scripts.forEach(script => {\n                    document.querySelector(`script[src='/js/${script}']`).remove()\n                })\n            }\n            if (currentRoute.unload && typeof currentRoute.unload === 'function') {\n                currentRoute.unload()\n            }\n        }\n        const urlRoute = window.location.pathname\n        const newRoute = this.routers.find(item => item.route === urlRoute)\n        if (newRoute){\n            if (newRoute.scripts && newRoute.scripts.length > 0) {\n                for (const script of newRoute.scripts) {\n                    await _utils_file_utils__WEBPACK_IMPORTED_MODULE_4__.FileUtils.loadPageScript('/js/' + script)\n                }\n            }\n            if (newRoute.title){\n                this.titleElement.innerText = newRoute.title + ' | Lumincoin Finance'\n            }\n            if (newRoute.template){\n                let contentBlock = this.contentPageElement\n                if (newRoute.useLayout) {\n                    this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text())\n                    contentBlock = document.getElementById('content-layout')\n\n                    document.body.classList.add('layout-fixed')\n\n                    this.activateMenuItem(newRoute)\n                } else {\n                    document.body.classList.remove('layout-fixed')\n                }\n                contentBlock.innerHTML = await fetch(newRoute.template).then(response => response.text())\n            }\n\n            if (newRoute.load && typeof newRoute.load === 'function'){\n                newRoute.load()\n            }\n        }else{\n            console.log('404')\n            await this.activateRoute()\n        }\n    }\n    activateMenuItem(route) {\n        document.querySelectorAll('.sidebar .nav-link').forEach(item => {\n            const href = item.getAttribute('href')\n            if ((route.route.includes(href) && href !== '/') || route.route === '/' && href === '/') {\n                item.classList.add('active')\n            } else {\n                item.classList.remove('active')\n            }\n\n        })\n    }\n}\n\n//# sourceURL=webpack://frontend/./src/router.js?");

/***/ }),

/***/ "./src/utils/file-utils.js":
/*!*********************************!*\
  !*** ./src/utils/file-utils.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   FileUtils: () => (/* binding */ FileUtils)\n/* harmony export */ });\nclass FileUtils{\n    static loadPageScript(src){\n        return new Promise((resolve, reject) => {\n            const script = document.createElement('script')\n            script.src = src\n            script.onload = () =>{\n                resolve('Script loaded: ' + src)\n            }\n            script.onerror = () =>{\n                reject(new Error('Script load error: ' + src))\n            }\n            document.body.appendChild(script)\n        })\n    }\n}\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n//# sourceURL=webpack://frontend/./src/utils/file-utils.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/app.js");
/******/ 	
/******/ })()
;