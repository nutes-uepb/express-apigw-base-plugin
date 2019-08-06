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
    post: function (url, credentials) {
        return instance.post(url, credentials)
    },

    delete: function (url) {
        return instance.delete(url)
    }
}
