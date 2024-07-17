
import {HttpUtils} from "../../utils/http-utils";
import {AuthUtils} from "../../utils/auth-utils";
import {DefaultResponseType} from "../../types/default-response.type";


export class Logout {
    readonly openNewRoute: (url: string | null) => Promise<void>
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            return this.openNewRoute('/login')
        }
        this.logout().then()
    }

    private async logout(): Promise<void> {
        const result: DefaultResponseType =  await HttpUtils.request('/logout', 'POST', false,{
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








