'use strict'
/**
 * Policy to validate JWT
 */
const passportJWT = require('passport-jwt')
const fs = require('fs')
let passport = require('passport')
let gatewayService = require('express-gateway/lib/services')

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

module.exports = function (actionParams, testContext) {
    // Test context. In testContext we have mocks functions.
    if (testContext && testContext.isTest) {
        passport = testContext.passport
        gatewayService = testContext.services
    }

    const secretOrKey = actionParams.secretOrPublicKeyFile ?
        fs.readFileSync(actionParams.secretOrPublicKeyFile, 'utf8') : actionParams.secretOrPublicKey

    passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: secretOrKey,
        issuer: actionParams.issuer
    }, (jwtPayload, done) => {
        // At this point both the jwt signature, issuer and experation were validated
        // In addition, we have the jwt payload decoded and we can access its attributes

        // User validation. We expect to receive the username in the jwt 'sub' field
        if (!jwtPayload.sub) return done(null, false)

        gatewayService.auth
            .validateConsumer(jwtPayload.sub, {checkUsername: true})
            .then((consumer) => {
                if (!consumer) {
                    // invalid username or inactive user
                    return done(null, false, {message: 'Invalid or inactive user'})
                }
                return done(null, jwtPayload) // jwt successfully authenticated
            })
            .catch((err) => {
                if (err.message === 'CREDENTIAL_NOT_FOUND') {
                    return done(null, false, {message: 'User not found'})
                }
                return done(err)
            })
    }))

    return (req, res, next) => {
        passport.authenticate('jwt', {session: false}, (err, user, info) => {
            if (user) {
                req.user = user
                next()
            }

            if (info && info.message === 'No auth token') return res.status(401).send({
                'code': 401,
                'message': 'UNAUTHORIZED',
                'description': 'Authentication failed for lack of authentication credentials.',
                'redirect_link': '/auth'
            })

            if (info && info.message === 'Invalid or inactive user') return res.status(401).send({
                'code': 401,
                'message': 'UNAUTHORIZED',
                'description': 'The token user is not properly registered as a consumer at the gateway.',
                'redirect_link': '/auth'
            })

            if (info && info.message === 'jwt expired') return res.status(401).send({
                'code': 401,
                'message': 'UNAUTHORIZED',
                'description': 'Authentication failed because access token is expired.',
                'redirect_link': '/auth'
            })

            if (info && info.message === 'jwt issuer invalid.') return res.status(401).send({
                'code': 401,
                'message': 'UNAUTHORIZED',
                'description': 'Authentication failed because the access token contains invalid parameters.',
                'redirect_link': '/auth'
            })

            if (info && info.message) return res.status(401).send({
                'code': 401,
                'message': 'UNAUTHORIZED',
                'description': 'Authentication failed due to access token issues.',
                'redirect_link': '/auth'
            })
        })(req, res, next)
    }
}
