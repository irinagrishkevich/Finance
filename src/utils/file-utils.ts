export class FileUtils{
    public static loadPageScript(src: string): Promise<string>{
        return new Promise((resolve, reject) => {
            const script: HTMLScriptElement | null = document.createElement('script')
            script.src = src
            script.onload = ():void =>{
                resolve('Script loaded: ' + src)
            }
            script.onerror = ():void =>{
                reject(new Error('Script load error: ' + src))
            }
            document.body.appendChild(script)
        })
    }
}
















