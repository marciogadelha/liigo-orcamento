const axios = require('axios');

const FlexyAPI = class FlexyAPI {
  
  constructor() {
    this.api = axios.create({
      baseURL: 'https://liigo.api.flexy.com.br/platform/api/',
    })
  }

  async getUntilSuccess(info, config) {
    let response = null
    while(!response) {
      try {
        console.log("GET Info: " + info)
        console.log("GET Config: " + config.params.referenceCodes)
        response = await this.api.get(info, config)
        console.log(response)
        console.log(response.data)
      } catch(error) {
        console.log(error.message)
        await this.sleep(10000)
      }
    }
    return response
  }

  async getData(info, limit) {
    const config = {
      params: {
        token: "ud6qqbo04cn3pujrebunba",
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
  
  async getProducts() {
    const responseData = await this.getData('products', 50)
    return responseData
  }

  async getProduct(product) {
    const config = {
      params: {
        token: "ud6qqbo04cn3pujrebunba",
      }
    }
    const response = await this.getUntilSuccess('products/' + product, config)
    return response.data[0]
  }

  async getStore(store) {
    const config = {
      params: {
        token: "ud6qqbo04cn3pujrebunba",
        referenceCodes: store
      }
    }
    const response = await this.getUntilSuccess('shopping-store', config)
    return response.data[0]
  }

  sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = FlexyAPI
