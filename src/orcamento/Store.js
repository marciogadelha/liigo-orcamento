
export default class Store {
    constructor(name, categories) {
        this.name = name
        this.categories = []
        this.addCategory(categories)
    }

    addCategory(c) {
        if (Array.isArray(c)) {
            for (let it of c) {
                this.addCategory(it)
            }
        } else {
            if (c && this.categories.indexOf(c) == -1) {
                this.categories.push(c)
            }
        }
    }
}
