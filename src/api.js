const express = require('express');
const cors = require('cors')
const Categories = require('./orcamento/Categories')

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

module.exports = api;
