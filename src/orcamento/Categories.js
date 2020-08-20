const FlexyAPI = require('./FlexyAPI');
const CategoryTree = require('./CategoryTree');
const Store = require('./Store');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const dom = new JSDOM();

const Categories = class Categories {

  constructor() {
      this.apiFlexy = new FlexyAPI()
      this.root = new CategoryTree("root", null, 0)
      this.divCategory = dom.window.document.createElement('div')
      this.divCategory.setAttribute('id', 'categories')
      this.divCategory.setAttribute('class', 'row ml-3 mr-3 h-100 mh-100 overflow-auto')
      this.main()
  }

  getLayout() {
    return this.divCategory.outerHTML
  }

  getStores(categorySelected) {
    return this.root.findNode(categorySelected).stores
  }
  
  loadList(category) {
    let div = dom.window.document.createElement('div')
    div.setAttribute('id', category.referenceCode)
    div.setAttribute('class', 'overflow-auto list-group tab-pane collapse')
    div.setAttribute('height', '500')
    div.setAttribute('maxheight', '500')
    div.setAttribute('role', 'tab')
    for (let child of category.nodes) {
      let a = dom.window.document.createElement('a')
      a.setAttribute('class', 'list-group-item list-group-item-action')
      a.setAttribute('id', category.referenceCode + '-' + child.referenceCode)
      a.setAttribute('data-toggle', 'list')
      a.setAttribute('href', '#' + child.referenceCode)
      a.setAttribute('role', 'tab')
      a.setAttribute('aria-controls', child.referenceCode)
      a.setAttribute('aria-labelledby', category.referenceCode)
      a.textContent = child.name
      div.appendChild(a)
    }
    return div
  }

  loadSubCategories(subCategories) {
    let secondLevel = dom.window.document.createElement('div')
    secondLevel.setAttribute('id', 'second-level')
    secondLevel.setAttribute('class', 'col-3 pl-0 pr-0 h-100 mh-100 overflow-auto')

    let thirdLevel = dom.window.document.createElement('div')
    thirdLevel.setAttribute('id', 'third-level')
    thirdLevel.setAttribute('class', 'col-3 pl-0 pr-0 h-100 mh-100 overflow-auto')

    let fourthLevel = dom.window.document.createElement('div')
    fourthLevel.setAttribute('id', 'fourth-level')
    fourthLevel.setAttribute('class', 'col-3 pl-0 pr-0 h-100 mh-100 overflow-auto')

    for (let secondCategoryLevel of subCategories) {
      let secondDivLevel = this.loadList(secondCategoryLevel)
      secondLevel.appendChild(secondDivLevel)
      for (let thirdCategoryLevel of secondCategoryLevel.nodes) {
        let thirdDivLevel = this.loadList(thirdCategoryLevel)
        thirdLevel.appendChild(thirdDivLevel)
        for (let fourthCategoryLevel of thirdCategoryLevel.nodes) {
          let fourthDivLevel = this.loadList(fourthCategoryLevel)
          fourthLevel.appendChild(fourthDivLevel)
        }
      }
    }

    this.divCategory.appendChild(secondLevel)
    this.divCategory.appendChild(thirdLevel)
    this.divCategory.appendChild(fourthLevel)
  }

  async main() {
    while(true) {
      
      const categories = await this.apiFlexy.getCategories()
      console.log(categories)
      this.root.insertArrayNodes(categories)
      console.log(this.root)
      const total = this.root.printTree('')
      console.log(total)

      let firstLevel = dom.window.document.createElement('div')
      firstLevel.setAttribute('id', 'first-level')
      firstLevel.setAttribute('class', 'col-3 pl-0 pr-0 h-100 mh-100 overflow-auto list-group tab-pane show active')
      firstLevel.setAttribute('role', 'tablist')
      const categoriesNode = this.root.findNodeByName("Categorias")
      for (let category of categoriesNode.nodes) {
        let a = dom.window.document.createElement('a')
        a.setAttribute('class', 'list-group-item list-group-item-action')
        a.setAttribute('id', 'root-' + category.referenceCode)
        a.setAttribute('data-toggle', 'list')
        a.setAttribute('href', '#' + category.referenceCode)
        a.setAttribute('role', 'tab')
        a.setAttribute('aria-controls', category.referenceCode)
        a.textContent = category.name
        firstLevel.appendChild(a)
      }

      this.divCategory = dom.window.document.createElement('div')
      this.divCategory.setAttribute('id', 'categories')
      this.divCategory.setAttribute('class', 'row ml-3 mr-3 h-100 mh-100 overflow-auto')
      
      this.divCategory.appendChild(firstLevel)

      this.loadSubCategories(categoriesNode.nodes)

      const products = await this.apiFlexy.getProducts()
      console.log(products)

      let stores = []
      for (let p of products) {
        for (let c of p.categories) {
          let node = this.root.findNode(c)
          if (node) {
            node.addStore(p.shoppingStore)
          }
        }
        let store = null
        for (let s of stores) {
          if (s.name == p.shoppingStore) {
            store = s
            break
          }
        }
        if (store) {
          store.addCategory(p.categories)
        } else {
          stores.push(new Store(p.shoppingStore, p.categories))
        }
      }
      console.log(stores)
      this.root.printTree('')

    }
  }
}

module.exports = Categories;
