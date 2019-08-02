'use strict'

/**
 * Delete user gateway policy
 */

let gatewayService = require('express-gateway/lib/services').user
let userService = require('../../services/user-service')

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
            await userService.delete(`${actionParams.urlDeleteService}/${userId}`)

            // 2. Find user at gateway and delete or skip if there is not.
            //    When the deleted user was not found in the gateway,
            //    it occurs when the user has not yet logged in to the platform.
            const userGateway = await gatewayService.findByUsernameOrId(userId)
            if (userGateway) await gatewayService.remove(userGateway.id)

            return res.status(204).send()
        } catch (err) {
            console.error(new Date().toUTCString(), '| Error removing API Gateway user:', error.message)
            return res.status(204).send()
        }
    }
}

