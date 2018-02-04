const webpack = require('webpack')
const compiler = webpack(require('../webpack.config'))
const webpackDevMiddleware = require('webpack-dev-middleware')(compiler, {serverSideRender: true})
const requireFromString = require('require-from-string')
const ReactDOMServer = require('react-dom/server')
const createElement = require('react').createElement
let higherOrderComponents = []
const apollo = require('./apollo')
const gql = require('graphql-tag')
const React = require('react')

const ApolloProvider = require('react-apollo').ApolloProvider
higherOrderComponents.push(function (WrappedComponent) {
    return class extends React.Component {
        render() {
            return createElement(ApolloProvider, {client: apollo}, createElement(WrappedComponent))
        }
    }
})

module.exports = {
    addHigherOrderComponent(Component) {
        higherOrderComponents.push(Component)
    },

    routing: async function (req, res, next) {
        const entry = await apollo.query({
            query: gql`
                query GetEntry($uri: String) {
                    entry(uri: $uri) {
                        id
                        section {
                            siteSettings {
                                template
                            }
                        }
                    }
                }
            `,
            variables: {
                uri: req.url.replace(/^\//, '')
            }
        })
        .then(res => res.data.entry)
        const template = entry.section.siteSettings[0].template
        req.originalUrl = req.url
        req.url = `/${template}`
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