const axios = require('axios');

const FlexyAPI = class FlexyAPI {
  
  constructor() {
    this.api = axios.create({
      baseURL: 'https://liigo.api.flexy.com.br/platform/api/',
    })
  }

  async getData(info, limit) {
    const config = {
      params: {
        token: "ud6qqbo04cn3pujrebunba",
        limit: limit,
        offset: 0
      }
    }
    try {
      let responseData = []
      console.log("nextResponse: ")
      let nextResponse = await this.api.get(info, config)
      console.log("Teste")
      console.log(nextResponse)
      responseData = responseData.concat(nextResponse.data)
      while(nextResponse.data.length === config.params.limit) {
        console.log(config.params.offset)
        config.params.offset += config.params.limit
        nextResponse = await this.api.get(info, config)
        responseData = responseData.concat(nextResponse.data)
      }
      return responseData
    } catch(err) {
      console.log("Failed to get '" + info + "'!")
    }
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
