const policy = require('../../../policies/auth/auth-policy')
const assert = require('chai').assert
const sinon = require('sinon')
const fakeCert = require('../certs/fake-certs')

describe('Policy: auth-policy', () => {
    describe('Integrity', () => {
        it('Field "name" is type valid', () => {
            assert.typeOf(policy.name, 'string', '"name" is not string type')
            assert.equal(policy.name, 'auth-policy', 'Policy name other than expected')
        })
        it('Field "policy" is type valid', () => {
            assert.typeOf(policy.policy, 'function', '"policy" is not function type')
        })
        it('Field "schema" is type valid', () => {
            assert.typeOf(policy.schema, 'object', '"schema" is not object type')
        })
        it('Field "schema.$id" is type valid', () => {
            assert.typeOf(policy.schema.$id, 'string', '"schema.$id" is not string type')
            assert.equal(policy.schema.$id, 'http://express-gateway.io/schemas/policies/auth-policy.json', '"schema.$id" different than expected')
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
        it('Field "schema.properties.urlauthservice" is type valid', () => {
            assert.typeOf(policy.schema.properties.urlAuthService, 'object', '"schema.properties.urlAuthService" is not object type')
            assert.equal(policy.schema.properties.urlAuthService.type, 'string', '"schema.properties.urlAuthService" different than expected')
        })
    })

    describe('Functionality', () => {
        it('should return a function(req,res,next)', () => {
            const actionParams = {
                secretOrPublicKey: fakeCert,
                issuer: 'issuer',
                urlAuthService: 'http://localhost:5000'
            }
            assert.typeOf(policy.policy(actionParams), 'function', '"policy" does not return a function')
            assert.equal(policy.policy(actionParams).length, 3, 'Function different than expected')
        })

        context('when the credentials are valid', () => {
            it('should create user gateway', function () {
                const req = {
                    body: {email: 'email@mail.com', password: 'password'}
                }
                const res = {
                    status: sinon.stub(),
                    send: sinon.spy()
                }

                res.status.withArgs().returns(res)

                const next = sinon.spy()

                const authService = {
                    post() {
                    }
                }
                const fakeResponseAuthService = {
                    status: 200,
                    data: {
                        'access_token': 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZDQxZjgzNGI0MmMxNzMwMjMwNWUyMWUiLCJzdWJfdHlwZSI6ImFkbWluIiwiaXNzIjoiaGFuaW90IiwiaWF0IjoxNTY0NzcwOTMxLCJzY29wZXMiOiJhZG1pbnM6Y3JlYXRlIGFkbWluczpyZWFkIGFkbWluczpyZWFkQWxsIGFkbWluczp1cGRhdGUgYWRtaW5zOmRlbGV0ZSBoZWFsdGhwcm9mZXNzaW9uYWxzOmNyZWF0ZSBoZWFsdGhwcm9mZXNzaW9uYWxzOnJlYWQgaGVhbHRocHJvZmVzc2lvbmFsczpyZWFkQWxsIGhlYWx0aHByb2Zlc3Npb25hbHM6dXBkYXRlIGhlYWx0aHByb2Zlc3Npb25hbHM6ZGVsZXRlIHBhdGllbnRzOmNyZWF0ZSBwYXRpZW50czpyZWFkIHBhdGllbnRzOnJlYWRBbGwgcGF0aWVudHM6dXBkYXRlIHBhdGllbnRzOmRlbGV0ZSBwaWxvdHM6Y3JlYXRlIHBpbG90czpyZWFkQWxsIHBpbG90czpyZWFkIHBpbG90czp1cGRhdGUgcGlsb3RzOmRlbGV0ZSBtZWFzdXJlbWVudHM6cmVhZCBtZWFzdXJlbWVudHM6cmVhZEFsbCBkZXZpY2VzOnJlYWQgZGV2aWNlczpyZWFkQWxsIGZvcm1zOnJlYWQgZm9ybXM6cmVhZEFsbCBldmFsdWF0aW9uczpyZWFkIGV2YWx1YXRpb25zOnJlYWRBbGwgbm90aWZpY2F0aW9uczpjcmVhdGUgbm90aWZpY2F0aW9uczpyZWFkIG5vdGlmaWNhdGlvbnM6cmVhZEFsbCBub3RpZmljYXRpb25zOmRlbGV0ZSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiY2hhbmdlX3Bhc3N3b3JkIjpmYWxzZSwiZXhwIjoxNTY0ODU3MzMxfQ.hHLK2NH3HCyc8FPDj_bgy9PPsU-UKE7xF9DmA1aq-GbNvGyUY0cDU8F9vBpXDeom0LjZjY59hV9jSl7Tklx0naIVFc_MoNBjaH80YkleeHrEWhiFjZljdykGE-_iWBXeYSqBLEfxBZBlqdCSlg3lROsx9E1MwrsK-e4_NR337ZJxi6rJXV5eo5HxbFU8f2k_qWYgU-d0Rj_ihWSqm_v5sGjetT4LkGZ9zOULDLfPnKmSd-ogPlqB_UXKlGg9-YZLjLgs-i-T_xZZ_TdXLfH_TnDMUVG76oKXuNFDChfj4cqfIMJNbKQijyyu7sqKkbkgz0O2mmTjstqF0RDV6rXn7XKAlwFK4rUEqXlgIa-2Dz8Hqs8sdTpI7xB1jMtF_YYMUmapG92VjWhD8WQiw3ySo0fVVc5VHa2ktY1Pv0H-K2F_b9ar3eHkJTiav9XGyS-TUonCM1j_GTddeVy6-G9pF5LrqaXO6bz2iBXUS0h_36BjjiLYb_UI2Aan08EqEgimCma8jVtxuxgF-YL-qkvdxjnTZrCloddcfS6WmlZyUmZAKhHS2Uoz8WYcKpYdhaiUsMfu_qXW9BgciUOU4j8kXxcYb8vYo8IvFKw5piX6UQ6a7NQm6dlMMuka75OKLKaaZ-NIwPO4OzoFkK2DD3QrGBggBCPc-ZFfklB1doIFB3I'
                    }
                }
                const promiseAuthService = Promise.resolve(fakeResponseAuthService)
                const auth = sinon.stub(authService, 'post')
                auth.withArgs('http://localhost:3000/users/auth', {
                    email: 'email@mail.com',
                    password: 'password'
                }).returns(promiseAuthService)

                const fakeUserInsert = {
                    username: 'FakeName'
                }

                const fakeGatewayUser = {
                    user: {
                        find() {
                        },
                        insert() {
                        }
                    }
                }
                const fakeJwt = {
                    verify(accessToken, secret, optios) {
                        return Promise.resolve({
                            'sub': '5d41f834b42c17302305e21e',
                            'sub_type': 'admin',
                            'iss': 'issuer',
                            'iat': 1564770931,
                            'scopes': 'admins:create admins:read admins:readAll admins:update admins:delete healthprofessionals:create healthprofessionals:read healthprofessionals:readAll healthprofessionals:update healthprofessionals:delete patients:create patients:read patients:readAll patients:update patients:delete pilots:create pilots:readAll pilots:read pilots:update pilots:delete measurements:read measurements:readAll devices:read devices:readAll forms:read forms:readAll evaluations:read evaluations:readAll notifications:create notifications:read notifications:readAll notifications:delete',
                            'email_verified': false,
                            'change_password': false,
                            'exp': 1564857331
                        })
                    }
                }
                const promiseServiceInsert = Promise.resolve(fakeUserInsert)
                const promiseServicesFind = Promise.resolve(false)

                const find = sinon.stub(fakeGatewayUser.user, 'find')
                find.withArgs('5d41f834b42c17302305e21e').returns(promiseServicesFind)
                const insert = sinon.stub(fakeGatewayUser.user, 'insert')
                insert.withArgs().returns(promiseServiceInsert)

                const actionParams = {
                    urlAuthService: 'http://localhost:3000/users/auth',
                    secretOrPublicKey: fakeCert,
                    issuer: 'issuer'
                }

                md_policy = policy.policy(actionParams, authService, {fakeGatewayUser, fakeJwt})
                return md_policy(req, res, next)
                    .then(() => {
                        sinon.assert.calledOnce(auth)
                        sinon.assert.calledWith(find, '5d41f834b42c17302305e21e')
                        sinon.assert.calledWith(insert, {username: '5d41f834b42c17302305e21e'})
                        //sinon.assert.calledWith(res.status,200);
                        sinon.assert.notCalled(next)

                        auth.restore()
                        find.restore()
                        insert.restore()
                    })


            })

            it('should not create user gateway', function () {
                const req = {
                    body: {email: 'email@mail.com', password: 'password'}
                }
                const res = {
                    status: sinon.stub(),
                    send: sinon.spy()
                }

                res.status.withArgs().returns(res)

                const next = {}

                const authService = {
                    post() {
                    }
                }
                const fakeResponseAuthService = {
                    status: 200,
                    data: {
                        'access_token': 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZDQxZjgzNGI0MmMxNzMwMjMwNWUyMWUiLCJzdWJfdHlwZSI6ImFkbWluIiwiaXNzIjoiaGFuaW90IiwiaWF0IjoxNTY0NzcwOTMxLCJzY29wZXMiOiJhZG1pbnM6Y3JlYXRlIGFkbWluczpyZWFkIGFkbWluczpyZWFkQWxsIGFkbWluczp1cGRhdGUgYWRtaW5zOmRlbGV0ZSBoZWFsdGhwcm9mZXNzaW9uYWxzOmNyZWF0ZSBoZWFsdGhwcm9mZXNzaW9uYWxzOnJlYWQgaGVhbHRocHJvZmVzc2lvbmFsczpyZWFkQWxsIGhlYWx0aHByb2Zlc3Npb25hbHM6dXBkYXRlIGhlYWx0aHByb2Zlc3Npb25hbHM6ZGVsZXRlIHBhdGllbnRzOmNyZWF0ZSBwYXRpZW50czpyZWFkIHBhdGllbnRzOnJlYWRBbGwgcGF0aWVudHM6dXBkYXRlIHBhdGllbnRzOmRlbGV0ZSBwaWxvdHM6Y3JlYXRlIHBpbG90czpyZWFkQWxsIHBpbG90czpyZWFkIHBpbG90czp1cGRhdGUgcGlsb3RzOmRlbGV0ZSBtZWFzdXJlbWVudHM6cmVhZCBtZWFzdXJlbWVudHM6cmVhZEFsbCBkZXZpY2VzOnJlYWQgZGV2aWNlczpyZWFkQWxsIGZvcm1zOnJlYWQgZm9ybXM6cmVhZEFsbCBldmFsdWF0aW9uczpyZWFkIGV2YWx1YXRpb25zOnJlYWRBbGwgbm90aWZpY2F0aW9uczpjcmVhdGUgbm90aWZpY2F0aW9uczpyZWFkIG5vdGlmaWNhdGlvbnM6cmVhZEFsbCBub3RpZmljYXRpb25zOmRlbGV0ZSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiY2hhbmdlX3Bhc3N3b3JkIjpmYWxzZSwiZXhwIjoxNTY0ODU3MzMxfQ.hHLK2NH3HCyc8FPDj_bgy9PPsU-UKE7xF9DmA1aq-GbNvGyUY0cDU8F9vBpXDeom0LjZjY59hV9jSl7Tklx0naIVFc_MoNBjaH80YkleeHrEWhiFjZljdykGE-_iWBXeYSqBLEfxBZBlqdCSlg3lROsx9E1MwrsK-e4_NR337ZJxi6rJXV5eo5HxbFU8f2k_qWYgU-d0Rj_ihWSqm_v5sGjetT4LkGZ9zOULDLfPnKmSd-ogPlqB_UXKlGg9-YZLjLgs-i-T_xZZ_TdXLfH_TnDMUVG76oKXuNFDChfj4cqfIMJNbKQijyyu7sqKkbkgz0O2mmTjstqF0RDV6rXn7XKAlwFK4rUEqXlgIa-2Dz8Hqs8sdTpI7xB1jMtF_YYMUmapG92VjWhD8WQiw3ySo0fVVc5VHa2ktY1Pv0H-K2F_b9ar3eHkJTiav9XGyS-TUonCM1j_GTddeVy6-G9pF5LrqaXO6bz2iBXUS0h_36BjjiLYb_UI2Aan08EqEgimCma8jVtxuxgF-YL-qkvdxjnTZrCloddcfS6WmlZyUmZAKhHS2Uoz8WYcKpYdhaiUsMfu_qXW9BgciUOU4j8kXxcYb8vYo8IvFKw5piX6UQ6a7NQm6dlMMuka75OKLKaaZ-NIwPO4OzoFkK2DD3QrGBggBCPc-ZFfklB1doIFB3I'
                    }
                }
                const promiseAuthService = Promise.resolve(fakeResponseAuthService)
                const auth = sinon.stub(authService, 'post')
                auth.withArgs('http://localhost:3000/users/auth', {
                    email: 'email@mail.com',
                    password: 'password'
                }).returns(promiseAuthService)

                const fakeUserInsert = {
                    username: 'FakeName'
                }

                const fakeGatewayUser = {
                    user: {
                        find() {
                        },
                        insert() {
                        }
                    }
                }
                const fakeJwt = {
                    verify(accessToken, secret, optios) {
                        return Promise.resolve({
                            'sub': '5d41f834b42c17302305e21e',
                            'sub_type': 'admin',
                            'iss': 'issuer',
                            'iat': 1564770931,
                            'scopes': 'admins:create admins:read admins:readAll admins:update admins:delete healthprofessionals:create healthprofessionals:read healthprofessionals:readAll healthprofessionals:update healthprofessionals:delete patients:create patients:read patients:readAll patients:update patients:delete pilots:create pilots:readAll pilots:read pilots:update pilots:delete measurements:read measurements:readAll devices:read devices:readAll forms:read forms:readAll evaluations:read evaluations:readAll notifications:create notifications:read notifications:readAll notifications:delete',
                            'email_verified': false,
                            'change_password': false,
                            'exp': 1564857331
                        })
                    }
                }
                const promiseServiceInsert = Promise.resolve(fakeUserInsert)
                const promiseServicesFind = Promise.resolve(fakeUserInsert)

                const find = sinon.stub(fakeGatewayUser.user, 'find')
                find.withArgs('5d41f834b42c17302305e21e').returns(promiseServicesFind)
                const insert = sinon.stub(fakeGatewayUser.user, 'insert')
                insert.withArgs().returns(promiseServiceInsert)

                const actionParams = {
                    urlAuthService: 'http://localhost:3000/users/auth',
                    secretOrPublicKey: fakeCert,
                    issuer: 'issuer'
                }

                md_policy = policy.policy(actionParams, authService, {fakeGatewayUser, fakeJwt})
                return md_policy(req, res, next)
                    .then(() => {
                        sinon.assert.calledOnce(auth)
                        sinon.assert.notCalled(insert)
                        sinon.assert.calledWith(find, '5d41f834b42c17302305e21e')
                        sinon.assert.calledWith(res.status, 200)

                        auth.restore()
                        find.restore()
                        insert.restore()
                    })


            })
        })

        context('when the credentials not are valid', () => {
            it('should return status code 401-UNAUTHORIZED', function () {
                const req = {
                    body: {email: 'email@mail.com', password: 'password'}
                }
                const res = {
                    status: sinon.stub(),
                    send: sinon.spy()
                }

                res.status.withArgs().returns(res)

                const next = {}

                const authService = {
                    post() {
                    }
                }
                const fakeResponseAuthService = {
                    response: {
                        status: 401,
                        data: {
                            'message': 'Credentials no found or invalid'
                        }
                    }
                }
                const promiseAuthService = Promise.reject(fakeResponseAuthService)
                const auth = sinon.stub(authService, 'post')
                auth.withArgs('http://localhost:3000/users/auth', {
                    email: 'email@mail.com',
                    password: 'password'
                }).returns(promiseAuthService)

                const fakeUserInsert = {
                    username: 'FakeName'
                }

                const services = {
                    user: {
                        find() {
                        },
                        insert() {
                        }
                    }
                }
                const promiseServiceInsert = Promise.resolve(fakeUserInsert)
                const promiseServicesFind = Promise.resolve(false)

                const find = sinon.stub(services.user, 'find')
                find.withArgs('1234567890').returns(promiseServicesFind)
                const insert = sinon.stub(services.user, 'insert')
                insert.withArgs().returns(promiseServiceInsert)

                const actionParams = {
                    urlAuthService: 'http://localhost:3000/users/auth',
                    secretOrPublicKey: fakeCert,
                    issuer: 'issuer'
                }

                md_policy = policy.policy(actionParams, authService, services)
                return md_policy(req, res, next)
                    .then(() => {
                        sinon.assert.calledOnce(auth)
                        sinon.assert.notCalled(find)
                        sinon.assert.notCalled(insert)
                        sinon.assert.calledWith(res.status, 401)

                        auth.restore()
                        find.restore()
                        insert.restore()

                    })


            })
        })

    })
})
