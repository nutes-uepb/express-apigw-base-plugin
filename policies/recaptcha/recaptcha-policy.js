/**
 * Recaptcha Policy
 *
 */
module.exports = {
    name: 'recaptcha-policy',
    policy: require('./recaptcha'),
    schema: {
        name: 'recaptcha',
        $id: 'http://express-gateway.io/schemas/policies/recaptcha-policy.json',
        type: 'object',
        properties: {
            serverKey: {
                type: 'string'
            },
            recaptchaResponse: {
                type: 'string'
            }
        },
        required: ['serverKey', 'recaptchaResponse']
    }
}
