'use strict'

/**
 * Plug-in export file
 * Where all plug-in policies, conditions, and routes are logged
 */
const fs = require('fs')
const apiReferencePathFile = process.env.API_REFERENCE_PATH_FILE
module.exports = {
    version: '1.0.1',
    init: function (pluginContext) {
        pluginContext.registerPolicy(require('./policies/authentication/jwt-policy'))
        pluginContext.registerPolicy(require('./policies/authorization/jwt-scopes-policy'))
        pluginContext.registerPolicy(require('./policies/auth/auth-policy'))
        pluginContext.registerPolicy(require('./policies/body-parser/body-parser-policy'))
        pluginContext.registerPolicy(require('./policies/delete-user/delete-user-policy'))
        pluginContext.registerPolicy(require('./policies/recaptcha/recaptcha-policy'))
        pluginContext.registerCondition(require('./conditions/regex-path-method'))
        pluginContext.registerGatewayRoute(require('./routes/middlewares'))
        if (fs.existsSync(apiReferencePathFile)) {
            pluginContext.registerGatewayRoute(require(apiReferencePathFile))
        }
    },
    // this is for CLI to automatically add to "policies" whitelist in gateway.config
    policies: ['jwt-policy', 'jwtScopes-policy', 'auth-policy', 'body-parser-policy', 'delete-user-policy', 'recaptcha-policy']
}
