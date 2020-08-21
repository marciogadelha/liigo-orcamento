
const Store = class Store {
    constructor(referenceCode, categories) {
        this.referenceCode = referenceCode
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

module.exports = Store
