
import {AuthUtils} from "./auth-utils";
import config from "../config/config";
import {DefaultResponseType} from "../types/default-response.type";



export class HttpUtils{ // error
    public static async request(url: string, method: string = 'GET', useAuth:boolean = true, body: any | null = null): Promise<any> {
        const params: any = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        }

        let token: string | null = null
        if (useAuth){
            token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) as string
            if (token){
                params.headers['x-auth-token'] = token
            }
        }
        if (body){
            params.body = JSON.stringify(body)
        }
        const response : Response = await fetch(config.host + url, params);
        // try {
        //     response = await fetch(config.host + url, params)
        //     const result
        //     result.response = await response.json()
        // } catch (e){
        //     result.error = true
        //     return  result
        // }
        if (response.status < 200 || response.status >= 300) {
            if (useAuth && response.status === 401){
                const result: DefaultResponseType | Response = await this.request(url, method, useAuth, body)
                if (!token){
                    // 1 токена нет
                    (result as DefaultResponseType).redirect
                } else {
                    // 2 токена устарел/невалидный (надо обновить)
                    const updatedTokenResult: boolean = await AuthUtils.updateRefreshToken()

                    if (updatedTokenResult){
                        // запрос повторно
                        return this.request(url, method, useAuth, body)
                    }else {
                        (result as DefaultResponseType).redirect
                    }


                }


            }
        }
        return await response.json()
    }
}