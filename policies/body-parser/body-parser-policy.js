/**
 * Policy to convert req in object javascript
 */
module.exports = {
    name: 'body-parser-policy',
    policy: require('./body-parser'),
    schema: {
        $id: 'http://express-gateway.io/schemas/policies/body-parser-policy.json',
        type: 'object',
        properties: {}
    }
}
