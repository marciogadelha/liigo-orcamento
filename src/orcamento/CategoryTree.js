
export default class CategoryTree {

    constructor(name, referenceCode, sortOrder) {
        this.name = name
        this.referenceCode = referenceCode
        this.sortOrder = sortOrder
        this.parent = null
        this.nodes = []
        this.stores = []
    }

    getNodes() {
        return this.nodes
    }

    addNode(node) {
        if (node) {
            node.parent = this
        }
        let i = 0
        while (i < this.nodes.length && node.sortOrder > this.nodes[i].sortOrder) {
            i += 1
        }
        while (i < this.nodes.length && node.sortOrder == this.nodes[i].sortOrder && node.name > this.nodes[i].name) {
            i += 1
        }
        this.nodes.splice(i, 0, node)
    }

    findNode(referenceCode) {
        const children = this.getNodes()
        let child
        for (child of children) {
          if (child.referenceCode == referenceCode) {
            return child
          }
        }
        for (child of children) {
          const found = child.findNode(referenceCode)
          if (found) {
            return found
          }
        }
        return null
    }

    findNodeByName(name) {
      const children = this.getNodes()
      let child
      for (child of children) {
        if (child.name == name) {
          return child
        }
      }
      for (child of children) {
        const found = child.findNodeByName(name)
        if (found) {
          return found
        }
      }
      return null
    }
      
    insertNode(c, categories) {
      const existNode = this.findNode(c.referenceCode)
      if (existNode) {
        return existNode
      }
      const newNode = new CategoryTree(c.name, c.referenceCode, c.sortOrder)
      if (c.parent) {
        const parent = this.findNode(c.parent)
        if (parent) {
          parent.addNode(newNode)
        } else {
          for (let it of categories) {
            if (it.referenceCode == c.parent) {
              const parentFound = this.insertNode(it, categories)
              parentFound.addNode(newNode)
              break
            }
          }
        }
      } else {
        this.addNode(newNode)
      }
      return newNode
    }

    insertArrayNodes(categories) {
        for (let it of categories) {
            this.insertNode(it, categories)
        }
    }

    printTree(indent) {
        let total = 0
        const children = this.getNodes()
        total += children.length
        const indentNew = indent + '  '
        for (let child of children) {
          console.log(indentNew + child.name + ' | ' + child.referenceCode + ' | Stores: ' + child.stores)
          total += child.printTree(indentNew)
        }
        return total
    }

    addStore(store) {
      if (store && this.stores.indexOf(store) == -1) {
        this.stores.push(store)
      }
    }
}
