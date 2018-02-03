const express = require('express')
const app = express()
const webpack = require('webpack')
const compiler = webpack(require('./webpack.config'))
const middleware = require('webpack-dev-middleware')(compiler, {serverSideRender: true})
const requireFromString = require('require-from-string')
const ReactDOMServer = require('react-dom/server')
const createElement = require('react').createElement

app.use(middleware)

app.get('*', (req, res) => {
    const url = req.url === '/' ? 'index' : req.url.replace(/^\//, '')
    const bundle = middleware.context.fs.readFileSync(`/${url}.js`)
    let Component = requireFromString(bundle.toString('utf8'))
    Component = Component.default || Component
    res.send(ReactDOMServer.renderToString(createElement(Component, null)))
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))