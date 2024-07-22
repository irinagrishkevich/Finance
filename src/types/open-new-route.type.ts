export type  OpenNewRouteFunction = {
    (url: string | null): Promise<void>
}