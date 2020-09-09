const FlexyAPI = require('./FlexyAPI');
const CategoryTree = require('./CategoryTree');
// const Store = require('./Store');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const dom = new JSDOM();

const Categories = class Categories {

  constructor() {
      this.apiFlexy = new FlexyAPI()
      this.root = new CategoryTree("root", null, 0)
      this.divCategory = dom.window.document.createElement('div')
      this.divCategory.setAttribute('id', 'categories')
      this.divCategory.setAttribute('class', 'row mx-0 overflow-hidden')
      this.main()
  }

  getLayout() {
    return this.divCategory.outerHTML
  }

  getStores(categorySelected) {
    const node = this.root.findNode(categorySelected)
    if (node) {
      return node.stores
    }
    return null
  }

  putQuoteProduct(enabledForEmptyPriceList) {
    return this.apiFlexy.putQuoteProduct(enabledForEmptyPriceList)
  }
  
  loadList(category) {
    let div = dom.window.document.createElement('div')
    div.setAttribute('id', category.referenceCode)
    div.setAttribute('class', 'overflow-auto list-group tab-pane fade collapse')
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

  loadSubCategories(newDivCategory, subCategories) {
    let secondLevel = dom.window.document.createElement('div')
    secondLevel.setAttribute('id', 'second-level')
    secondLevel.setAttribute('class', 'h-100 col-md-3 px-0 overflow-auto ')

    let thirdLevel = dom.window.document.createElement('div')
    thirdLevel.setAttribute('id', 'third-level')
    thirdLevel.setAttribute('class', 'h-100 col-md-3 px-0 overflow-auto ')

    let fourthLevel = dom.window.document.createElement('div')
    fourthLevel.setAttribute('id', 'fourth-level')
    fourthLevel.setAttribute('class', 'h-100 col-md-3 px-0 overflow-auto ')

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

    newDivCategory.appendChild(secondLevel)
    newDivCategory.appendChild(thirdLevel)
    newDivCategory.appendChild(fourthLevel)
  }

  loadCategories(newDivCategory, categoriesNode) {
    let firstLevel = dom.window.document.createElement('div')
    firstLevel.setAttribute('id', 'first-level')
    firstLevel.setAttribute('class', 'h-100 col-md-3 px-0 overflow-auto list-group tab-pane fade show active')
    firstLevel.setAttribute('role', 'tablist')
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
    newDivCategory.appendChild(firstLevel)
  }

  load = async() => {
      const categories = await this.apiFlexy.getCategories()
      console.log(categories)
      this.root.insertArrayNodes(categories)
      console.log(this.root)
      const total = this.root.printTree('')
      console.log(total)

      const categoriesNode = this.root.findNodeByName("Categorias")
      let newDivCategory = dom.window.document.createElement('div')
      this.loadCategories(newDivCategory, categoriesNode)
      this.loadSubCategories(newDivCategory, categoriesNode.nodes)
      this.divCategory.innerHTML = newDivCategory.innerHTML
      this.divCategory.style.height = categoriesNode.nodes.length*45 + 1 + 'px'
      
      const stores = await this.apiFlexy.getStores()

      const budgetProduct = await this.apiFlexy.getProduct('solicitacaoorcamento')
      const budgetStores = budgetProduct.masterVariant.distributionCenterList
      let ableStores = []
      for (let budgetStore of budgetStores) {
        const referenceCodeStore = budgetStore.distributionCenter.referenceCode
        if (referenceCodeStore && ableStores.indexOf(referenceCodeStore) == -1) {
          const store = stores.find((s) => {
            return (s.referenceCode === referenceCodeStore && s.isActivated === true && s.isEnabled === true)
          })
          if (store) {
            ableStores.push(store.referenceCode)
          }
        }
      }
      console.log(ableStores)

      const products = await this.apiFlexy.getProducts()

      for (let p of products) {
        if (Array.isArray(p.categories)) {
          for (let c of p.categories) {
            let node = this.root.findNode(c)
            if (node) {
              for (let productStore of p.masterVariant.distributionCenterList) {
                if (productStore.distributionCenter.referenceCode && ableStores.indexOf(productStore.distributionCenter.referenceCode) != -1) {
                  node.addStore(productStore.distributionCenter.referenceCode)
                }
              }
            }
          }
        }
      }
      this.root.printTree('')
  }

  main = async () => {
    while (true) {
      await this.load()
      await this.apiFlexy.sleep(172800000)
    }
  }

}

module.exports = Categories;
