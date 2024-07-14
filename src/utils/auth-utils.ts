import config from "../config/config";
import {UserInfo} from "../types/user-info.type";
import {RefreshResponseType} from "../types/refresh-response.type";


export class AuthUtils {
    public static accessTokenKey: string = 'accessToken'
    private static refreshTokenKey: string = 'refreshToken'
    private static userInfoKey: string = 'userInfo'


    public static setAuthInfo(accessToken:string, refreshToken: string, userInfo: UserInfo | null = null):void {
        localStorage.setItem(this.accessTokenKey, accessToken)
        localStorage.setItem(this.refreshTokenKey, refreshToken)
        if (userInfo){
            localStorage.setItem(this.userInfoKey, JSON.stringify(userInfo))
        }
    }

    public static removeAuthInfo():void {
        localStorage.removeItem(this.accessTokenKey)
        localStorage.removeItem(this.refreshTokenKey)
        localStorage.removeItem(this.userInfoKey)
    }


    public static getAuthInfo(key: string | null = null):string | { [key: string]: string | UserInfo | null } | null{
        if (key && [this.accessTokenKey, this.refreshTokenKey, this.userInfoKey].includes(key)) {
            return localStorage.getItem(key)
        } else {
            return {
                [this.accessTokenKey]: localStorage.getItem(this.accessTokenKey),
                [this.refreshTokenKey]: localStorage.getItem(this.refreshTokenKey),
                [this.userInfoKey]: JSON.parse(localStorage.getItem(this.userInfoKey) as string) as UserInfo | null
            }
        }
    }

    public static async updateRefreshToken(): Promise<boolean> {
        let result: boolean = false
        const refreshToken: string | null = this.getAuthInfo(this.refreshTokenKey) as string
        if (refreshToken) {
            const response: Response | null = await fetch(config.host + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    refreshToken: refreshToken
                })
            })
            if (response && response.status === 200) {
                const tokens: RefreshResponseType | null = await response.json()
                if (tokens && !tokens.error && tokens.accessToken && tokens.refreshToken) {
                    this.setAuthInfo(tokens.accessToken, tokens.refreshToken)
                    result = true
                }
            }
        }
        if (!result) {
            this.removeAuthInfo()
        }
        return result

    }

}