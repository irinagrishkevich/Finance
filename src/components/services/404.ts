import {OpenNewRouteFunction} from "../../types/open-new-route.type";

export class Error404 {
    readonly openNewRoute: OpenNewRouteFunction
    constructor(openNewRoute:OpenNewRouteFunction) {
        this.openNewRoute = openNewRoute
        this.reloadPage().then()
    }
    async reloadPage(): Promise<void> {
        const navigationEntries = performance.getEntriesByType('navigation');
        if (navigationEntries.length > 0 && (navigationEntries[0] as PerformanceNavigationTiming).type === 'reload') {
            await this.openNewRoute('/');
        }

    }
}