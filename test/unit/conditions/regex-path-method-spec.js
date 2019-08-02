const condition = require('../../../conditions/regex-path-method')
const assert = require('chai').assert

describe('Condition: regex-path-method', () => {
    describe('Integrity', () => {
        it('Field "name" is type valid', () => {
            assert.typeOf(condition.name, 'string', '"name" is not string type')
            assert.equal(condition.name, 'regex-path-method', 'Condition name other than expected')
        })
        it('Field "handler" is type valid', () => {
            assert.typeOf(condition.handler, 'function', '"handler" is not function type')
        })
        it('Field "schema" is type valid', () => {
            assert.typeOf(condition.schema, 'object', '"schema" is not object type')
        })
        it('Field "schema.$id" is type valid', () => {
            assert.typeOf(condition.schema.$id, 'string', '"schema.$id" is not string type')
            assert.equal(condition.schema.$id, 'http://express-gateway.io/schemas/conditions/regex-path-method.json', '"schema.$id" different than expected')
        })
        it('Field "schema.type" is type valid', () => {
            assert.typeOf(condition.schema.type, 'string', '"schema.type" is not object type')
            assert.equal(condition.schema.type, 'object', '"schema.type" different than expected')
        })
        it('Field "schema.properties" is type valid', () => {
            assert.typeOf(condition.schema.properties, 'object', '"schema.properties" is not object type')
        })
        it('Field "schema.properties.regexpath" is type valid', () => {
            assert.typeOf(condition.schema.properties.regexPath, 'object', '"schema.properties.regexpath" is not object type')
            assert.typeOf(condition.schema.properties.regexPath.type, 'string', '"schema.properties.regexpath" is not object string type')
        })
        it('Field "schema.properties.method" is type valid', () => {
            assert.typeOf(condition.schema.properties.method, 'object', '"schema.properties.method" is not object type')
            assert.typeOf(condition.schema.properties.method.type, 'string', '"schema.properties.method" is not object string type')
        })
        it('Field "schema.required" is type valid', () => {
            assert.typeOf(condition.schema.required, 'array', '"schema.required" is not array type')
            assert.equal(condition.schema.required[0], 'regexPath', '"schema.required" different than expected')
        })

    })

    describe('Functionality', () => {
        it('When the request matches the all settings', () => {
            const req = {
                url: '/v1/auth',
                method: 'POST'
            }
            const conditionConfig = {
                regexPath: '^(/v1/auth)$',
                method: 'POST'
            }
            assert.equal(true, condition.handler(req, conditionConfig), 'Handler should return "true"')
        })
        it('When the request matches the regexPath but not the method', () => {
            const req = {
                url: '/v1/auth',
                method: 'GET'
            }
            const conditionConfig = {
                regexPath: '^(/v1/auth)$',
                method: 'POST'
            }
            assert.equal(false, condition.handler(req, conditionConfig), 'Handler should return "false"')
        })
        it('When the request not matches the any settings', () => {
            const req = {
                url: '/users/fakeid',
                method: 'GET'
            }
            const conditionConfig = {
                regexPath: '^(/v1/auth)$',
                method: 'POST'
            }
            assert.equal(false, condition.handler(req, conditionConfig), 'Handler should return "false"')
        })

    })
})
