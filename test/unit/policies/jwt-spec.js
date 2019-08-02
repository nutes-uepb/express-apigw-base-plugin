const policy = require('../../../policies/authentication/jwt-policy')
const assert = require('chai').assert
const sinon = require('sinon')
const fakeCert = require('../certs/fake-certs')

describe('Policy: jwt-policy', () => {

    describe('Integrity', () => {
        it('Field "name" is type valid', () => {
            assert.typeOf(policy.name, 'string', '"name" is not string type')
            assert.equal(policy.name, 'jwt-policy', 'Policy name other than expected')
        })
        it('Field "policy" is type valid', () => {
            assert.typeOf(policy.policy, 'function', '"policy" is not function type')
        })
        it('Field "schema" is type valid', () => {
            assert.typeOf(policy.schema, 'object', '"schema" is not object type')
        })
        it('Field "schema.$id" is type valid', () => {
            assert.typeOf(policy.schema.$id, 'string', '"schema.$id" is not string type')
            assert.equal(policy.schema.$id, 'http://express-gateway.io/schemas/policies/jwt-policy.json', '"schema.$id" different than expected')
        })
        it('Field "schema.type" is type valid', () => {
            assert.typeOf(policy.schema.type, 'string', '"schema.type" is not object type')
            assert.equal(policy.schema.type, 'object', '"schema.type" different than expected')
        })
        it('Field "schema.properties" is type valid', () => {
            assert.typeOf(policy.schema.properties, 'object', '"schema.properties" is not object type')
        })
        it('Field "schema.properties.secretOrPublicKey" is type valid', () => {
            assert.typeOf(policy.schema.properties.secretOrPublicKey, 'object', '"schema.properties.secretOrPublicKey" is not object type')
            assert.equal(policy.schema.properties.secretOrPublicKey.type, 'string', '"schema.properties.secretOrPublicKey" different than expected')
        })
        it('Field "schema.properties.secretOrPublicKeyFile" is type valid', () => {
            assert.typeOf(policy.schema.properties.secretOrPublicKeyFile, 'object', '"schema.properties.secretOrPublicKeyFile" is not object type')
            assert.equal(policy.schema.properties.secretOrPublicKeyFile.type, 'string', '"schema.properties.secretOrPublicKeyFile" different than expected')
        })
        it('Field "schema.properties.issuer" is type valid', () => {
            assert.typeOf(policy.schema.properties.issuer, 'object', '"schema.properties.issuer" is not object type')
            assert.equal(policy.schema.properties.issuer.type, 'string', '"schema.properties.issuer" different than expected')
        })
    })

    describe('Functionality', () => {
        it('should return a function(req,res,next)', function () {
            const services = {
                auth: {
                    validateConsumer() {
                    }
                }
            }
            const actionParams = {
                secretOrPublicKey: fakeCert,
                issuer: 'haniot'
            }
            const testContext = {
                services: services
            }
            assert.typeOf(policy.policy(actionParams, testContext), 'function', '"policy" does not return a function')
            assert.equal(policy.policy(actionParams, testContext).length, 3, 'Function different than expected')
        })

        context('should validate token', () => {
            it('when the token and consumer is valid, should call next()', async function () {

                const req = {
                    headers: {
                        authorization: 'Bearer eyJhbGciOiJSUzI1NiIsfgInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZDQxZjgzNGI0MmMxNzMwMjMwNWUyMWUiLCJzdWJfdHlwZSI6ImFkbWluIiwiaXNzIjoiaGFuaW90IiwiaWF0IjoxNTY0NzcwOTMxLCJzY29wZSI6ImFkbWluczpjcmVhdGUgYWRtaW5zOnJlYWQgYWRtaW5zOnJlYWRBbGwiLCJleHAiOjE1NjQ4NTczMzF9.Spe_vOVUYBc4xhgL160_yGV4UT43yFEbdLQMpCBZeN8kRFnX35Oegtyg5ge-kAbwXyyHhYOD_rEdHdIswAGLaZewgRlu1gWlQ4ZEFHPXZRKl-H2pHsaRO_Pzm9OEPfMgA-A7DnxCRbuvZtQNJZ4a8x5T8HqRHc0jklHH6z023G47XCf7dS2gRpI5nOgdyHG5YmsnC0mx261AbMDf560yA7mazq4vs9JN-x1CM32Trrx_jR46Whch2A_i62pacY17cGpBXI0d5U6skGQ5A85JUcjr0cwqdNEHDL9GVfY0a0afIlnfucNnSRg-UnwUZhq2ycBqK0haNxQebHwVPrUFI0nbNylyZzwcJUyziRNxfZWNguEnO6Oh7HjrKfcSDfv5Y11B7XvGrRaSpvNFFq0M-Zj0yVyhA7qmcDA3x3p6DGlvcEYRA-_wpXTr6Jy9RmLZlqDxbVbGbtc89tn4V4-ZYYe-NY60omoW8X4T5uw19t8q6WkWfjnl2fbIW6aygOvrpHSajXEHp8OYel2MgXKdvIhDlQHCJkKu3Jfej7_zlnKiKoxnXE2BUkMyCzwqqKm_NyWpmdGma-a1rieJoYPur9nsaqIcem6zOVAoxhN0KgTFsxovHE9ceigH4t8cN0-RFuoREUJMHJROyKGVM4OhE1kNI3zHXQVxe2FXQpsBn8M'
                    }
                }

                const res = {
                    end: sinon.spy()
                }

                const next = sinon.spy()

                const fakeConsumer = {
                    sub: '5d41f834b42c17302305e21e',
                    username: 'fakeConsumer'
                }

                const services = {
                    auth: {
                        validateConsumer() {
                        }
                    }
                }

                const promisevalidateConsumer = Promise.resolve(fakeConsumer)

                const validateConsumer = sinon.stub(services.auth, 'validateConsumer')
                validateConsumer.withArgs('5d41f834b42c17302305e21e').returns(promisevalidateConsumer)

                const passport = {
                    strategy: null,
                    use(strategy) {
                        this.strategy = strategy
                    },
                    authenticate(name, opts) {

                        return (req, res, next) => {
                            const done = (opts, user, msg) => {
                                if (user) {
                                    next()
                                }
                            }
                            this.strategy._verify({
                                sub: '5d41f834b42c17302305e21e',
                                iss: 'haniot',
                                iat: 1564857331,
                                scope: 'admins:create admins:read admins:readAll'
                            }, done)
                        }
                    }
                }

                const actionParams = {
                    secretOrPublicKey: fakeCert,
                    issuer: 'haniot'
                }

                const testContext = {
                    isTest: true,
                    services: services,
                    passport: passport
                }


                const mid = policy.policy(actionParams, testContext)

                await mid(req, res, next)

                sinon.assert.calledWith(validateConsumer, '5d41f834b42c17302305e21e')
                sinon.assert.called(next)

            })

            it('when the token is valid but the consumer was not found or is inactive, should not call next ()', async function () {

                const req = {
                    headers: {
                        authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZDQxZjgzNGI0MmMxNzMwMjMwNWUyMWUiLCJzdWJfdHlwZSI6ImFkbWluIiwiaXNzIjoiaGFuaW90IiwiaWF0IjoxNTY0NzcwOTMxLCJzY29wZSI6ImFkbWluczpjcmVhdGUgYWRtaW5zOnJlYWQgYWRtaW5zOnJlYWRBbGwiLCJleHAiOjE1NjQ4NTczMzF9.Spe_vOVUYBc4xhgL160_yGV4UT43yFEbdLQMpCBZeN8kRFnX35Oegtyg5ge-kAbwXyyHhYOD_rEdHdIswAGLaZewgRlu1gWlQ4ZEFHPXZRKl-H2pHsaRO_Pzm9OEPfMgA-A7DnxCRbuvZtQNJZ4a8x5T8HqRHc0jklHH6z023G47XCf7dS2gRpI5nOgdyHG5YmsnC0mx261AbMDf560yA7mazq4vs9JN-x1CM32Trrx_jR46Whch2A_i62pacY17cGpBXI0d5U6skGQ5A85JUcjr0cwqdNEHDL9GVfY0a0afIlnfucNnSRg-UnwUZhq2ycBqK0haNxQebHwVPrUFI0nbNylyZzwcJUyziRNxfZWNguEnO6Oh7HjrKfcSDfv5Y11B7XvGrRaSpvNFFq0M-Zj0yVyhA7qmcDA3x3p6DGlvcEYRA-_wpXTr6Jy9RmLZlqDxbVbGbtc89tn4V4-ZYYe-NY60omoW8X4T5uw19t8q6WkWfjnl2fbIW6aygOvrpHSajXEHp8OYel2MgXKdvIhDlQHCJkKu3Jfej7_zlnKiKoxnXE2BUkMyCzwqqKm_NyWpmdGma-a1rieJoYPur9nsaqIcem6zOVAoxhN0KgTFsxovHE9ceigH4t8cN0-RFuoREUJMHJROyKGVM4OhE1kNI3zHXQVxe2FXQpsBn8M'
                    }
                }

                const res = {
                    send: sinon.spy(),
                    status() {
                    },
                    end: sinon.spy()
                }

                const status = sinon.stub(res, 'status')
                status.withArgs(401).returns(res)

                const next = sinon.spy()

                const fakeConsumer = {
                    sub: '5d41f834b42c17302305e21e',
                    username: 'fakeConsumer'
                }

                const services = {
                    auth: {
                        validateConsumer(a, b) {
                        }
                    }
                }

                const promisevalidateConsumer = Promise.reject(false)

                const validateConsumer = sinon.stub(services.auth, 'validateConsumer')
                validateConsumer.withArgs('5d41f834b42c17302305e21e', {checkUsername: true}).returns(promisevalidateConsumer)

                const passport = {
                    strategy: null,
                    use(strategy) {
                        this.strategy = strategy
                    },
                    authenticate(name, opts) {

                        return (req, res, next) => {
                            const done = (opts, user, msg) => {
                                if (user) {
                                    next()
                                }
                            }
                            this.strategy._verify({
                                sub: '5d41f834b42c17302305e21e',
                                sub_type: 'admin',
                                iss: 'haniot',
                                iat: 1542652211107,
                                scope: 'users:readAll2'
                            }, done)
                        }
                    }
                }

                const actionParams = {
                    secretOrPublicKey: fakeCert,
                    issuer: 'haniot'
                }

                const testContext = {
                    isTest: true,
                    services: services,
                    passport: passport
                }


                const mid = policy.policy(actionParams, testContext)

                await mid(req, res, next)

                sinon.assert.calledWith(validateConsumer, '5d41f834b42c17302305e21e', {checkUsername: true})
                sinon.assert.notCalled(next)

            })

            it('when the token is not valid, should return Unauthorized with statusCode 401', async function () {

                const req = {
                    headers: {
                        authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZDQxZjgzNGI0MmMxNzMwMjMwNWUyMWUiLCJzdWJfdHlwZSI6ImFkbWluIiwiaXNzIjoiaGFuaW90IiwiaWF0IjoxNTY0NzcwOTMxLCJzY29wZXMiOiJhZG1pbnM6Y3JlYXRlIGFkbWluczpyZWFkIGFkbWluczpyZWFkQWxsIiwiZXhwIjoxNTY0ODU3MzMxfQ.ftFsTL30hiehWuG1bG0TZLztmMQpishNuNFhGEe98WjSn8irkBfHKvkqBWlUKyLeykI-KKZERTqXbxDcGeICdccaCdxpA7nPozb1sC7_UiHYJ2Ncca1I9Ni7rYjdRms8RGWW4ThqWnDdlMs5n-mzmmimUJDKapWVhEyYVr3zjApSj4YFm_WevzJI_ih1sTtRHjL2rvN3QdQU5jZHP9KzfnFWkowjTgCoABgBMZ29ER_KfgvwmnsNx7_ADjbxrmJpollJ0htLcOpJOVxxqZVkl9NrkW8G-tQ90u1RRbUkxYzwj2-BMO52-b4v7wYmHegAG23c3ZnYxfVNbmZ-o-74SRMHHeQfwbPND0AcWGn54X-nLDXGJRiGkwZRwMEyFCGfu1ySpR43xUnSgA66FMi-FDnIzjRY8nCABkHEWaRxHV6jiKfhev8fq0K09YP98WqqteWg5zUVQIWCBwF3h3wKerSWL-oMSf0U0CENe_woJ_fePvROqTsADlJVlXVcQrLEEiBBT1HWtaU26i5wPRgbYt85N0UOx77FdV_k9LbD7KLh87Hiymn5L_2w4YKeEjlIqCQQfHc-xpGIFsCu4qE9h-8nc5GHMzMTYM09pc5qEyBet7llNyPjzSpOcOhksFPSdP1UdaPTDvNn-UOGh4tecjpBBuWfeR3SKfrOtLlO-40'
                    }
                }

                const res = {
                    statusCode: 0,
                    end: sinon.spy()
                }

                const next = sinon.spy()

                const fakeConsumer = {
                    sub: '5d41f834b42c17302305e21e',
                    username: 'fakeConsumer'
                }

                const services = {
                    auth: {
                        validateConsumer() {
                        }
                    }
                }

                const promisevalidateConsumer = Promise.resolve(fakeConsumer)

                const validateConsumer = sinon.stub(services.auth, 'validateConsumer')
                validateConsumer.withArgs('5d41f834b42c17302305e21e').returns(promisevalidateConsumer)

                const passport = {
                    strategy: null,
                    use(strategy) {
                        this.strategy = strategy
                    },
                    authenticate(name, opts) {

                        return (req, res, next) => {
                            const done = (opts, user, msg) => {
                                if (user) {
                                    next()
                                }
                            }
                            res.statusCode = 401
                            res.end('Unauthorized')
                        }
                    }
                }

                const actionParams = {
                    secretOrPublicKey: fakeCert,
                    issuer: 'haniot'
                }

                const testContext = {
                    isTest: true,
                    services: services,
                    passport: passport
                }


                const mid = policy.policy(actionParams, testContext)

                await mid(req, res, next)

                sinon.assert.notCalled(next)
                sinon.assert.calledWith(res.end, 'Unauthorized')
                assert.equal(res.statusCode, 401)
            })

        })

    })
})
