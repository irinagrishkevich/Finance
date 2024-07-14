
import {AuthUtils} from "./auth-utils";
import config from "../config/config";
import {ErrorRes} from "../types/error-res.type";


export class HttpUtils{
    public static async request(url: string, method: string = 'GET', useAuth:boolean = true, body: any | null = null): Promise<ErrorRes> {
        const result: ErrorRes = {
            error: false,
            response: null,
            redirect: null
        }


        const params: {method: string, headers: HeadersInit, body?: string } | undefined = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',

            }, body: body

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
        let response : Response | null = null
        try {
            response = await fetch(config.host + url, params as RequestInit)
            result.response = await response.json()
        } catch (e){
            result.error = true
            return  result
        }

        if (response.status < 200 || response.status >= 300) {
            result.error = true
            if (useAuth && response.status === 401){
                if (!token){
                    // 1 токена нет
                    result.redirect = '/login'
                } else {
                    // 2 токена устарел/невалидный (надо обновить)
                    const updatedTokenResult: boolean = await AuthUtils.updateRefreshToken()

                    if (updatedTokenResult){
                        // запрос повторно
                        return this.request(url, method, useAuth, body)
                    }else {
                        result.redirect = '/login'
                    }


                }


            }
        }
        return result
    }
}