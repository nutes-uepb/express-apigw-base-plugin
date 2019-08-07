'use strict'
/**
 * Policy to validate scopes
 */
module.exports = function (actionParams) {
    const jwt_scopes = (expectedScopes) => {
        if (!Array.isArray(expectedScopes)) {
            throw new Error('Parameter expectedScopes must be an array of strings representing the scopes for the endpoint(s)')
        }

        return function (req, res, next) {
            if (expectedScopes.length === 0) return next()
            if (!req.user || typeof req.user.scope !== 'string') return error(res)

            const scopes = req.user.scope.split(' ')
            const allowed = expectedScopes.some(scope => scopes.indexOf(scope) !== -1)

            return allowed ? next() : error(res)
        }
    }

    return (req, res, next) => {
        jwt_scopes(req.egContext.apiEndpoint.scopes)(req, res, next)
    }
}

function error(res) {
    return res.status(403).send({
        'code': 403,
        'message': 'FORBIDDEN',
        'description': 'Authorization failed due to insufficient permissions.'
    })
}
