const axios = require('axios');

const FlexyAPI = class FlexyAPI {
  
  constructor() {
    this.api = axios.create({
      baseURL: 'https://liigo.api.flexy.com.br/platform/api/',
    })
    this.token = "ud6qqbo04cn3pujrebunba"
  }

  async getUntilSuccess(info, config) {
    let response = null
    while(!response) {
      try {
        console.log(info)
        response = await this.api.get(info, config)
      } catch(error) {
        console.log(error.message)
      }
    }
    return response
  }

  async getData(info, limit) {
    const config = {
      params: {
        token: this.token,
        limit: limit,
        offset: 0
      }
    }
    let responseData = []
    let nextResponse = await this.getUntilSuccess(info, config)
    responseData = responseData.concat(nextResponse.data)
    while(nextResponse.data.length === config.params.limit) {
      console.log(config.params.offset)
      config.params.offset += config.params.limit
      nextResponse = await this.getUntilSuccess(info, config)
      responseData = responseData.concat(nextResponse.data)
    }
    return responseData
  }

  async getCategories() {
    const responseData = await this.getData('categories', 100)
    return responseData
  }

  async getStores() {
    const responseData = await this.getData('shopping-store', 100)
    return responseData
  }

  async getProducts() {
    const responseData = await this.getData('products', 50)
    return responseData
  }

  async getProduct(product) {
    const config = {
      params: {
        token: this.token,
      }
    }
    const response = await this.getUntilSuccess('products/' + product, config)
    return response.data[0]
  }

  async putQuoteProduct(enabledForEmptyPriceList) {
    const config = {
      params: {
        token: this.token,
      }
    }
    const content = {
      "product": {
        "referenceCode": "solicitacaoorcamento",
        "enabledForEmptyPriceList": JSON.parse(enabledForEmptyPriceList)
      }
    }
    let response = null
    while(!response) {
      try {
        console.log(content)
        response = await this.api.put('products/', content, config)
      } catch(error) {
        console.log(error.message)
      }
    }
    return response
  }

  sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = FlexyAPI
