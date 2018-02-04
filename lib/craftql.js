const webpack = require('webpack')
const compiler = webpack(require('../webpack.config'))
const webpackDevMiddleware = require('webpack-dev-middleware')(compiler, {serverSideRender: true})
const requireFromString = require('require-from-string')
const ReactDOMServer = require('react-dom/server')
const createElement = require('react').createElement
let higherOrderComponents = []

module.exports = {
    addHigherOrderComponent(Component) {
        higherOrderComponents.push(Component)
    },

    routing: function (req, res, next) {
        req.originalUrl = req.url
        // req.url = '/story'
        next()
    },

    middleware: function(req, res, next) {
        req.app.use(webpackDevMiddleware)

        const url = req.url === '/' ? 'index' : req.url.replace(/^\//, '')
        const bundle = webpackDevMiddleware.context.fs.readFileSync(`/${url}.js`)
        let Component = requireFromString(bundle.toString('utf8'))
        Component = Component.default || Component

        let hoc
        for (var i=0,len=higherOrderComponents.length; i<len; i++) {
            hoc = higherOrderComponents[i]
            Component = hoc(Component)
        }

        res.send(ReactDOMServer.renderToString(createElement(Component, null)))
    }
}