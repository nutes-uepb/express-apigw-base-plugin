'use strict'

const helmet = require('helmet')
const cors = require('cors')
const PORT_HTTPS = process.env.PORT_HTTPS

/**
 * File to configuration globals middlewares
 */
module.exports = function (app) {
    app.use(helmet())

    app.use(cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEADER', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
        exposedHeaders: ['Content-Type', 'x-ratelimit-limit', 'x-ratelimit-remaining', 'X-Total-Count'],
        credentials: true,
        preflightContinue: false,
        optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
    }))


    // Redirect HTTP to HTTPS
    app.use(function (req, res, next) {
        if (req.secure) {
            next() // request was via https, so do no special handling
        } else {
            // request was via http, so redirect to https
            const host = req.headers.host || ''
            if (host.includes(':')) {
                res.writeHead(301, {Location: `https://${host.replace(/:\d+/, ':'.concat(PORT_HTTPS))}${req.url}`})
            } else {
                res.writeHead(301, {Location: `https://${host}${':'.concat(PORT_HTTPS)}${req.url}`})
            }
            res.end()
        }
    })
}
