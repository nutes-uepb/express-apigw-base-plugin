/**
 * Condition to verify that the requested meets the regular expression and method configured.
 * Only the regexpath parameter is required.
 */
module.exports = {
    name: 'regex-path-method',
    handler: function (req, conditionConfig) {
        const regex = new RegExp(conditionConfig.regexPath)
        if (conditionConfig.method) {
            return (regex.test(req.url) && req.method === conditionConfig.method)
        }
        return regex.test(req.url)
    },
    schema: {
        $id: 'http://express-gateway.io/schemas/conditions/regex-path-method.json',
        type: 'object',
        properties: {
            regexPath: {
                type: 'string'
            },
            method: {
                type: 'string'
            }
        },
        required: ['regexPath']
    }
}
