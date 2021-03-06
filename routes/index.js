const url = require('url')
const express = require('express')
const router = express.Router()
const needle = require('needle')
const apiCache = require('apicache')


// init cache

let cache = apiCache.middleware



// env vars

const API_BASE_URL = process.env.API_BASE_URL
const API_KEY_NAME = process.env.API_KEY_NAME
const API_KEY_VALUE = process.env.API_KEY_VALUE

router.get('/', cache('2 minutes') ,async (req, res) => {
    try{
        // console.log(url.parse(req.url, true).query)
        const params = new URLSearchParams({
            [API_KEY_NAME]: API_KEY_VALUE,
            ...url.parse(req.url, true).query,
        })

        const apiResponse = await needle('get', `${API_BASE_URL}?${params}`)
        const data = apiResponse.body

        if(process.env.NODE_ENV != 'dev'){
            console.log(`REQUESTED: ${API_BASE_URL}?${params}`)
        }

        res.status(200).json(data)
    }catch(error){
        res.status(500).json({error})
    }
})

module.exports = router