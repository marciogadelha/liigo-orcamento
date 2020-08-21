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
        response = await this.api.get(info, config)
        // console.log(response)
      } catch(error) {
        console.log(error.message)
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
  
}

module.exports = FlexyAPI
