/**
 * Policy to validate scopes
 */
module.exports = {
    name: 'jwtScopes-policy',
    policy: require('./jwt-scopes'),
    schema: {
        $id: 'http://express-gateway.io/schemas/policies/jwtScopes-policy.json',
        type: 'object',
        properties: {}
    }
}
