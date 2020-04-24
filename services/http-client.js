/**
 * Service created to request user authentication in the account service
 */
const https = require('https')
const axios = require('axios')

const instance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
})

module.exports = {
    post: function (url, body, config) {
        return instance.post(url, body, config)
    },

    delete: function (url, config) {
        return instance.delete(url, config)
    }
}
