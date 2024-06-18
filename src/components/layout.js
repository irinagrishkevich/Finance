export class Layout{
    constructor(){
        this.burgerTabElement = document.getElementById('burgerTab')
        this.burgerMenuElement = document.getElementById('burgerMenu')
        this.burgerElement = document.getElementById('burger')


        console.log(this.burgerMenuElement)
        console.log(this.burgerTabElement)
        this.addBurgerMenuEventListener()
    }
    addBurgerMenuEventListener() {
        if(this.burgerMenuElement && this.burgerTabElement){
            this.burgerTabElement.addEventListener('click', this.toggleBurgerMenu.bind(this))
        }
    }
    toggleBurgerMenu() {
        if(this.burgerMenuElement){
            this.burgerMenuElement.classList.toggle('d-none')
            this.burgerElement.classList.toggle('open')
        }
    }
}