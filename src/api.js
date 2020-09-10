const express = require('express');
const cors = require('cors')
const Categories = require('./orcamento/Categories')
const path = require('path')

const api = express();

api.use(cors())

const internalCorsOptions = {
    origin: 'https://liigo-orcamento.herokuapp.com/',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const externalCorsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const categories = new Categories()

api.get('/categories', cors(internalCorsOptions), async (req, res) => {
    const response = await categories.getLayout()
    res.send(response)
});

api.get('/stores/:categorySelected', cors(internalCorsOptions), async (req, res) => {
    const response = await categories.getStores(req.params.categorySelected)
    res.json(response)
});

api.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'))
});

api.get('/css/bootstrap.css', (req, res) => {
    res.sendFile(path.join(__dirname + '/css/bootstrap.css'))
});

api.get('/css/style.css', (req, res) => {
    res.sendFile(path.join(__dirname + '/css/style.css'))
});

api.get('/quote-cart.html.twig', (req, res) => {
    res.sendFile(path.join(__dirname + '/flexyadmin/quote-cart.html.twig'))
});

api.put('/quote/:enabledForEmptyPriceList', cors(externalCorsOptions), async (req, res) => {
    const response = await categories.putQuoteProduct(req.params.enabledForEmptyPriceList)
    res.sendStatus(response.status)
});

module.exports = api;
