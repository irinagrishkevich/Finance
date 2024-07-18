export type SignUpErrorType = {
    error: boolean,
    message: string,
    validation?: [
        {
            [key: string]: string
            message: string
        }
    ]
}