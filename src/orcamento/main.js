import FlexyAPI from './FlexyAPI'
import CategoryTree from './CategoryTree'
import Store from './Store'

const api = new FlexyAPI()

function loadList(category) {
  let div = document.createElement('div')
  div.setAttribute('id', category.referenceCode)
  div.setAttribute('class', 'overflow-auto list-group tab-pane fade collapse')
  div.setAttribute('height', '500')
  div.setAttribute('maxheight', '500')
  div.setAttribute('role', 'tab')
  for (let child of category.nodes) {
    let a = document.createElement('a')
    a.setAttribute('class', 'list-group-item list-group-item-action')
    a.setAttribute('id', category.referenceCode + '-' + child.referenceCode)
    a.setAttribute('data-toggle', 'list')
    a.setAttribute('href', '#' + child.referenceCode)
    a.setAttribute('role', 'tab')
    a.setAttribute('aria-controls', child.referenceCode)
    a.setAttribute('aria-labelledby', category.referenceCode)
    a.innerText = child.name
    div.appendChild(a)
  }
  return div
}

function loadSubCategories(subCategories) {
  let secondLevel = document.getElementById('second-level')
  for (let secondCategoryLevel of subCategories) {
    let secondDivLevel = loadList(secondCategoryLevel)
    secondLevel.appendChild(secondDivLevel)
    let thirdLevel = document.getElementById('third-level')
    for (let thirdCategoryLevel of secondCategoryLevel.nodes) {
      let thirdDivLevel = loadList(thirdCategoryLevel)
      thirdLevel.appendChild(thirdDivLevel)
      let fourthLevel = document.getElementById('fourth-level')
      for (let fourthCategoryLevel of thirdCategoryLevel.nodes) {
        let fourthDivLevel = loadList(fourthCategoryLevel)
        fourthLevel.appendChild(fourthDivLevel)
      }
    }
  }
}

async function main() {

  const categories = await api.getCategories()
  const root = new CategoryTree("root", null, 0)
  console.log(categories)
  root.insertArrayNodes(categories)
  console.log(root)
  const total = root.printTree('')
  console.log(total)

  let firstLevel = document.getElementById('first-level')
  const categoriesNode = root.findNodeByName("Categorias")
  for (let category of categoriesNode.nodes) {
    let a = document.createElement('a')
    a.setAttribute('class', 'list-group-item list-group-item-action')
    a.setAttribute('id', 'root-' + category.referenceCode)
    a.setAttribute('data-toggle', 'list')
    a.setAttribute('href', '#' + category.referenceCode)
    a.setAttribute('role', 'tab')
    a.setAttribute('aria-controls', category.referenceCode)
    a.innerText = category.name
    firstLevel.appendChild(a)
  }

  $('#first-level').on('hide.bs.tab', 'a', function() {
    $('#fourth-level>div').removeClass('active show')
    $('#fourth-level>div>a').removeClass('active show')
    $('#third-level>div').removeClass('active show')
    $('#third-level>div>a').removeClass('active show')
    $('#second-level>div').removeClass('active show')
    $('#second-level>div>a').removeClass('active show')

  })
  $('#second-level').on('hide.bs.tab', 'div', function() {
    $('#fourth-level>div').removeClass('active show')
    $('#fourth-level>div>a').removeClass('active show')
    $('#third-level>div').removeClass('active show')
    $('#third-level>div>a').removeClass('active show')
  })
  $('#third-level').on('hide.bs.tab', 'div', function() {
    $('#fourth-level>div').removeClass('active show')
    $('#fourth-level>div>a').removeClass('active show')
  })

  loadSubCategories(categoriesNode.nodes)

  let categorySelected = null
  $('div').on('shown.bs.tab', 'a.active', function() {
    categorySelected = $('a.active').last().attr('aria-controls')
    console.log(categorySelected)
    console.log(root.findNode(categorySelected).stores)
  })

  const products = await api.getProducts()
  console.log(products)

  let stores = []
  for (let p of products) {
    for (let c of p.categories) {
      let node = root.findNode(c)
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
  root.printTree('')

  
}

main()
