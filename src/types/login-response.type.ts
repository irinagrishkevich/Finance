export type LoginResponseType = {
    response:{
        tokens:{
            accessToken: string,
            refreshToken: string
        },
        user:{
            id: number,
            name: string,
            lastName: string
        }
    }
}