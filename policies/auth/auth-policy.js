/**
 * Login Policy
 *
 */
module.exports = {
    name: 'auth-policy',
    policy: require('./auth'),
    schema: {
        name: 'auth-policy',
        $id: 'http://express-gateway.io/schemas/policies/auth-policy.json',
        type: 'object',
        properties: {
            urlAuthService: {
                type: 'string'
            },
            secretOrPublicKey: {
                type: 'string'
            },
            secretOrPublicKeyFile: {
                type: 'string'
            },
            issuer: {
                type: 'string'
            }
        },
        required: ['urlAuthService', 'issuer'],
        oneOf: [{required: ['secretOrPublicKey']}, {required: ['secretOrPublicKeyFile']}]
    }
}
