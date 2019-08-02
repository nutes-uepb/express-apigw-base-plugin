# express-apigw-base-plugin

This plugin adds custom policies to the Express Gateway. For more information about Express Gateway plug-ins, see the documentation [Express Gateway - Plugins](https://www.express-gateway.io/docs/plugins/)

### How to manually install 
1. Execute:
```
npm install https://github.com/nutes-uepb/express-apigw-base-plugin --save
```
2. Add the installed plugin to the gateway system settings in the file "system.config.yml". As in the example below:

```javascript
plugins:
  express-apigw-base-plugin:
    package: 'express-apigw-base-plugin/manifest.js'
```
4. Okay, done that it is already possible to use the policies in "gateway.config.yml"

### How to install automatically

Plugins are bundled as Node modules and distributed through npm. The Express Gateway CLI is used to install and configure plugins.
Installed plugins are declared in the system.config.yml and are then ready to be used. Express Gateway CLI is a convenient way to install and enable plugins.
```bash
$ eg plugin install https://github.com/nutes-uepb/express-apigw-base-plugin
```

### Description of policies

* body-parser-policy: Converts the request into an object using the body-parser.
  + No configuration parameters
* auth-policy: Performs authentication and then validates the consumer at the express gateway.
  + Configuration parameters:
    - urlauthservice: Indicates authentication service url. (ie 'http://localhost:5000/api/users/auth')
    - secretOrPublicKey: String with the secret to validate JWT token. (ie 'mysecret')
    - secretOrPublicKeyFile: File with the secret to validate JWT token. (ie 'key.pem')
    - issuer: Valid JWT token issuer. (ie 'myapp')
* jwt-policy: Validates token jwt based on expiration time and emitter. In addition to verifying the existence of the respective consumer. NOTE: In the case of the jwt secret, it can be informed using one of two properties: "secretOrPublicKey" or "secretOrPublicKeyFile".
  + Configuration parameters:    
    - secretOrPublicKey: String with the secret to validate JWT token. (ie 'mysecret')
    - secretOrPublicKeyFile: File with the secret to validate JWT token. (ie 'key.pem')
    - issuer: Valid JWT token issuer. (ie 'myapp')
* jwtScopes-policy: Performs the validation of the necessary scopes in the requests. Remembering that each scope must be configuring in each apiPublica path. In case of multiple scopes, the policy verifies the existence of at least one of the scopes.
  + No configuration parameters
