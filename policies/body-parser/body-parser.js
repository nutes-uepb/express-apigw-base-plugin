/**
 * Policy to convert req in object javascript
 */
const {PassThrough} = require('stream')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const urlEncodedParser = bodyParser.urlencoded({extended: true})

module.exports = function (actionParams) {
    return (req, res, next) => {
        req.egContext.requestStream = new PassThrough()
        req.pipe(req.egContext.requestStream)

        return jsonParser(req, res, () => urlEncodedParser(req, res, next))
    }
}
