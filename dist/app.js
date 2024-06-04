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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Router: () => (/* binding */ Router)\n/* harmony export */ });\n/* harmony import */ var _components_auth_login__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/auth/login */ \"./src/components/auth/login.js\");\n/* harmony import */ var _components_main__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/main */ \"./src/components/main.js\");\n/* harmony import */ var _components_auth_sign_up__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/auth/sign-up */ \"./src/components/auth/sign-up.js\");\n\n\n\n\nclass Router {\n    constructor() {\n        this.titleElement = document.getElementById('title')\n        this.contentElement = document.getElementById('content')\n\n        this.initEvents()\n\n\n        this.routers = [\n            {\n                route: '/',\n                title: 'Главная',\n                template: 'templates/main.html',\n                styles: 'style/style.css',\n                load: () => {\n                    new _components_main__WEBPACK_IMPORTED_MODULE_1__.Main()\n                }\n            },\n            {\n                route: '/login',\n                title: 'Вход в систему',\n                template: 'templates/auth/login.html',\n                styles: 'style/style.css',\n                load: () => {\n                    new _components_auth_login__WEBPACK_IMPORTED_MODULE_0__.Login()\n                }\n            },\n            {\n                route: '/sign-up',\n                title: 'Регистрация',\n                template: 'templates/auth/sign-up.html',\n                styles: 'style/style.css',\n                load: () => {\n                    new _components_auth_sign_up__WEBPACK_IMPORTED_MODULE_2__.SignUp()\n                }\n            },\n        ]\n    }\n\n    initEvents() {\n        window.addEventListener('DOMContentLoaded', this.activeRoute.bind(this))\n        window.addEventListener('popstate', this.activeRoute.bind(this))\n    }\n\n    async activeRoute(){\n        const urlRoute = window.location.pathname\n        const newRoute = this.routers.find(item => item.route === urlRoute)\n        if (newRoute){\n            if (newRoute.title){\n                this.titleElement.innerText = newRoute.title + ' | Lumincoin Finance'\n            }\n            if (newRoute.template){\n                this.contentElement.innerHTML = await fetch(newRoute.template).then(response => response.text())\n            }\n\n            if (newRoute.load && typeof newRoute.load === 'function'){\n                newRoute.load()\n            }\n        }else{\n            console.log('404')\n        }\n    }\n\n    // async openRoute() {\n    //     const urlRoute = window.location.hash.split('?')[0]\n    //     if (urlRoute === '#/logout'){\n    //         await Auth.logout()\n    //         window.location.href = '#/'\n    //         return;\n    //     }\n    //     const newRoute = this.routers.find(item => item.route === urlRoute)\n    //\n    //     if (!newRoute) {\n    //         window.location.href = '#/'\n    //         return\n    //     }\n    //\n    //     this.contentElement.innerHTML =\n    //         await fetch(newRoute.template).then(response => response.text())\n    //     this.stylesElement.setAttribute('href', newRoute.styles)\n    //     this.titleElement.innerText = newRoute.title\n    //\n    //     const userInfo = Auth.getUserInfo()\n    //     const accessToken = localStorage.getItem(Auth.accessTokenKey)\n    //     if (userInfo && accessToken) {\n    //         this.profileElement.style.display = 'flex'\n    //         this.profileFullNameElement.innerText= userInfo.fullName\n    //     }else {\n    //         this.profileElement.style.display = 'none'\n    //     }\n    //\n    //\n    //     newRoute.load()\n    // }\n\n}\n\n//# sourceURL=webpack://frontend/./src/router.js?");

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