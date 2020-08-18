const express = require('express');
const cors = require('cors')
const Categories = require('./orcamento/Categories')
const path = require('path')

const api = express();

api.use(cors())

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const categories = new Categories()

api.get('/categories', cors(corsOptions), async (req, res) => {
    const response = await categories.getLayout()
    res.send(response)
});

api.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'))
});

api.get('/bootstrap.css', (req, res) => {
    res.sendFile(path.join(__dirname + '/bootstrap.css'))
});

api.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname + '/style.css'))
});

module.exports = api;
