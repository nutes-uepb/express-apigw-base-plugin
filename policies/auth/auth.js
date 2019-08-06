/**
 * Login Policy
 */
let jwt = require('jsonwebtoken')
const fs = require('fs')
let userService = require('../../services/http-client')
let gatewayService = require('express-gateway/lib/services')

module.exports = function (actionParams, authServiceTest, localServicesTest) {
    return async (req, res, next) => {
        // Test context, Mocks authService and services.
        if (authServiceTest && localServicesTest) {
            userService = authServiceTest
            gatewayService = localServicesTest.fakeGatewayUser
            jwt = localServicesTest.fakeJwt
        }

        try {
            // 1. Run authentication on the account-service
            const authResponse = await userService.post(actionParams.urlAuthService, req.body)
            const accessToken = authResponse.data.access_token

            // 2. Read JWT public key
            const secretOrKey = actionParams.secretOrPublicKeyFile ?
                fs.readFileSync(actionParams.secretOrPublicKeyFile, 'utf8') : actionParams.secretOrPublicKey

            // 3. Checks whether the token obtained matches the public key.
            const decode = await jwt.verify(accessToken, secretOrKey, {
                algorithms: ['RS256'],
                issuer: actionParams.issuer
            })
            // 3.1 Checks if the user ID to whom the token belongs is present. 'sub' is required.
            if (!decode.sub) throw new Error('UNAUTHORIZED')

            // 4. Get user in local database.
            //    If the user exists, there is nothing else to do.
            if (await gatewayService.user.find(decode.sub)) return res.status(200).send(authResponse.data)

            // 5. If the login was successful and the user is not yet registered at the local bank, the same is created.
            const userGateway = await gatewayService.user.insert({username: decode.sub})
            if (!userGateway) throw new Error('INTERNAL_ERROR')

            return res.status(200).send(authResponse.data)
        } catch (err) {
            if (err.response && err.response.data) {
                return res.status(err.response.status).send(err.response.data)
            }

            if (err.message === 'UNAUTHORIZED') return res.status(401).send(handlerMessageError(401))
            return res.status(500).send(handlerMessageError(500))
        }
    }
}

/**
 * Handler of general error messages.
 *
 * @param code
 * @returns {{code: number, message: string, description: string}}
 */
function handlerMessageError(code) {
    if (code === 401) return {
        'code': 401,
        'message': 'UNAUTHORIZED',
        'description': 'The token user is not properly registered as a consumer at the gateway.'
    }

    return {
        'code': 500,
        'message': 'INTERNAL SERVER ERROR',
        'description': 'An internal server error has occurred.'
    }
}

