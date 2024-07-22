import {HttpUtils} from "../../utils/http-utils";
import {AuthUtils} from "../../utils/auth-utils";
import {DefaultResponseType} from "../../types/default-response.type";
import {OpenNewRouteFunction} from "../../types/open-new-route.type";


export class Logout {
    readonly openNewRoute: OpenNewRouteFunction
    readonly userNameElement: HTMLInputElement | null

    constructor(openNewRoute: OpenNewRouteFunction) {
        this.openNewRoute = openNewRoute
        this.userNameElement = document.getElementById('profileName') as HTMLInputElement

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            this.openNewRoute('/login').then()
        }

        this.logout().then()
        
    }

    private async logout(): Promise<void> {
        const result: DefaultResponseType = await HttpUtils.request('/logout', 'POST', false, {
            refreshToken: AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)
        })
        if (result.error) {
            console.log(result.error)
            return
        }

        AuthUtils.removeAuthInfo()


        await this.openNewRoute('/login')
    }

}








