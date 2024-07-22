export type RouteType ={
    route: string,
    title?: string,
    template?: string,
    styles?: string,
    useLayout?: string,
    load: () => void,
    scripts?: string[],
}
