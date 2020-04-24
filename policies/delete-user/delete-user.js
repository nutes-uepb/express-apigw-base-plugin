'use strict'

/**
 * Delete user gateway policy
 */

let gatewayService = require('express-gateway/lib/services').user
let userService = require('../../services/http-client')

module.exports = function (actionParams, userServiceGwTest, axiosTest) {
    // Test context. Mocks serServiceGwTest and axiosTest
    if (userServiceGwTest && axiosTest) {
        gatewayService = userServiceGwTest
        userService = axiosTest
    }

    return async (req, res, next) => {

        const userId = req.url.split('/').pop()

        try {
            // 1. Delete user in account service.
            const responseAccount = await userService.delete(
                `${actionParams.urlDeleteService}/${userId}`,
                { headers: req.headers }
            )

            // 2. Find user at gateway and delete or skip if there is not.
            await deleteUserGateway(userId)

            return res.status(responseAccount.status).send(responseAccount.data)
        } catch (err) {

            if (err.response && err.response.status && err.response.data) {
                return res.status(err.response.status).send(err.response.data)
            }
            return res.status(500).send({
                'code': 500,
                'message': 'INTERNAL SERVER ERROR',
                'description': 'An internal server error has occurred.'
            })
        }
    }
}


/**
 * Function used to recover user and remove them from Gateway
 * @param userId
 * @returns {Promise<void>}
 */
async function deleteUserGateway(userId) {
    try {
        //    When the deleted user was not found in the gateway,
        //    it occurs when the user has not yet logged in to the platform.
        const userGateway = await gatewayService.findByUsernameOrId(userId)
        if (userGateway) await gatewayService.remove(userGateway.id)
    } catch (err) {
        console.error(new Date().toISOString(), '| Error Removing User on Gateway:\n', err)
    }
}
