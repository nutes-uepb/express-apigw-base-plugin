'use strict'

/**
 * Recaptcha Policy
 */
const {PassThrough} = require('stream')
let httpClient = require('../../services/http-client')
const logger = require('express-gateway/lib/logger').policy

module.exports = function (actionParams) {
    return async (req, res, next) => {
        try {
            const recaptchaResponse = extractResponse(req, actionParams)
            if (recaptchaResponse && recaptchaResponse !== 'undefined') {
                const url = `https://www.google.com/recaptcha/api/siteverify?secret=${actionParams.serverKey}
                &response=${recaptchaResponse}`
                const resultRecaptcha = await httpClient.post(url)
                if (!resultRecaptcha || !resultRecaptcha.data || !resultRecaptcha.data.success) {
                    return res.status(400).send(handlerCaptchaError(resultRecaptcha.data['error-codes']))
                }
                removeCaptchaResponse(req, actionParams)
            }
            next()
        } catch (e) {
            return res.status(400).send(handlerCaptchaError())
        }
    }
}

/**
 * Function used to extract recaptchaResponse value based on template string
 * @param req
 * @param actionParams
 * @returns {*}
 */
function extractResponse(req, actionParams) {
    try {
        return req.egContext.evaluateAsTemplateString(actionParams.recaptchaResponse)
    } catch (err) {
        throw new Error('Recaptcha Response not found!')
    }

}

/**
 * Recaptcha error handler.
 * @param captchaErrors
 * @returns {{code: number, message: string, descriptions: Array}}
 */
function handlerCaptchaError(captchaErrors) {
    const error = {
        'code': 400,
        'message': 'BAD REQUEST',
        'description': 'The captcha response is not valid.'
    }
    if (!captchaErrors || !captchaErrors.length) return error
    if (captchaErrors.includes('missing-input-secret')) {
        error.description = 'The secret parameter is missing.'
        logger.error('Failed to load recaptcha server secret key. Description: %s', error.description)
        return error
    }
    if (captchaErrors.includes('invalid-input-secret')) {
        error.description = 'The secret parameter is invalid or malformed.'
        logger.error('Failed to load recaptcha server secret key. Description: %s', error.description)
        return error
    }

    if (captchaErrors.includes('missing-input-response')) error.description = 'The response parameter is missing.'
    if (captchaErrors.includes('bad-request')) error.description = 'The request is invalid or malformed.'
    if (captchaErrors.includes('invalid-input-response')) {
        error.description = 'The response parameter is invalid or malformed.'
    }
    if (captchaErrors.includes('timeout-or-duplicate')) {
        error.description = 'The response is no longer valid: either is too old or has been used previously.'
    }
    return error
}

/**
 * Function used to remove recaptcha Response from request body
 * @param req
 * @param actionParams
 */
function removeCaptchaResponse(req, actionParams) {
    /* removing special characteres */
    const recaptchaResponse = actionParams.recaptchaResponse.replace(/\$|{|}/g, '')
    const fullKeys = recaptchaResponse.split('.')
    const responsekey = fullKeys[fullKeys.length - 1]
    /* removing recaptchaResponse from request body */
    delete req.body[responsekey]
    /* creating new body */
    const bodyData = JSON.stringify(req.body)
    req.headers['content-length'] = Buffer.byteLength(bodyData)
    req.egContext.requestStream = new PassThrough()
    req.egContext.requestStream.write(bodyData)
}
