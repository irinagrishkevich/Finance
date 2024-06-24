
import {AuthUtils} from "./auth-utils";
import config from "../config/config";


export class HttpUtils{
    static async request(url, method = 'GET', useAuth = true, body = null) {
        const result = {
            error: false,
            response: null,
            redirect: null
        }


        const params = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',

            },
        }
        let token = null
        if (useAuth){
            token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)

            if (token){
                params.headers['x-auth-token'] = token
            }
        }
        if (body){
            params.body = JSON.stringify(body)
        }

        let response = null
        try {
            response = await fetch(config.host + url, params)
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
                    const updatedTokenResult = await AuthUtils.updateRefreshToken()

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