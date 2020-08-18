const express = require('express');
const axios = require('axios');

const api = express();

api.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
  
api.use(express.json());

api.get('/categories', async (req, res) => {
    const connection = axios.create({
        baseURL: 'https://liigo.api.flexy.com.br/platform/api/',
    })
    const config = {
        params: {
            token: "ud6qqbo04cn3pujrebunba",
            limit: 50,
            offset: 0
        }
    }
    const response = await connection.get('categories', config)
    console.log(response)
    return response
});

api.get('/products', async (req, res) => {
    const connection = axios.create({
        baseURL: 'https://liigo.api.flexy.com.br/platform/api/',
    })
    const config = {
        params: {
            token: "ud6qqbo04cn3pujrebunba",
            limit: 50,
            offset: 0
        }
    }
    const response = await connection.get('products', config)
    console.log(response)
    return response
});

module.exports = api;
