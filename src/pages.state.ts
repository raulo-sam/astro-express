export interface Page {

}

export class PagesState {
    private static instance: PagesState
    private constructor(private template: string, pages: Page) {}

    static create(template: string, pages: Page){
        if(!this.instance) {
            PagesState.instance = new PagesState(template, pages)
        }
        return PagesState.instance

    }

    

}
