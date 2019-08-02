/**
 * Delte user gateway policy
 *
 */
module.exports = {
    name: 'delete-user-policy',
    policy: require('./delete-user'),
    schema: {
        name: 'delete-user-policy',
        $id: 'http://express-gateway.io/schemas/policies/delete-user-policy.json',
        type: 'object',
        properties: {
            urlDeleteService: {
                type: 'string'
            }
        },
        required: ['urlDeleteService']
    }
}
