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
const getDataFromTree = require('react-apollo').getDataFromTree

const ApolloProvider = require('react-apollo').ApolloProvider
higherOrderComponents.push(function (WrappedComponent) {
    return class extends React.Component {
        render() {
            return createElement(ApolloProvider, {client: apollo}, createElement(WrappedComponent, {entryId: this.props.entryId}))
        }
    }
})

module.exports = {
    addHigherOrderComponent(Component) {
        higherOrderComponents.push(Component)
    },

    routing: async function (req, res, next) {
        const url = req.url.replace(/^\//, '')

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
                uri: url || '__HOME__'
            }
        })
        .then(res => res.data.entry)

        if (entry) {
            const template = entry.section.siteSettings[0].template
            req.originalUrl = req.url
            req.entryId = entry.id
            req.url = `/${template}`
        }

        next()
    },

    middleware: function(req, res, next) {
        req.app.use(webpackDevMiddleware)

        const url = req.url === '/' ? 'index' : req.url.replace(/^\//, '')
        // console.log('the url is', `/${url}.js`)
        if (!webpackDevMiddleware.context.fs.existsSync(`/${url}.js`)) {
            return res.status(404).send('404')
        }

        const bundle = webpackDevMiddleware.context.fs.readFileSync(`/${url}.js`)
        let Component = requireFromString(bundle.toString('utf8'))
        Component = Component.default || Component

        let hoc
        for (var i=0,len=higherOrderComponents.length; i<len; i++) {
            hoc = higherOrderComponents[i]
            Component = hoc(Component)
        }

        const props = {entryId: req.entryId}
        // console.log('the props are', props)
        Component = createElement(Component, props)
        getDataFromTree(Component).then(() => {
            const content = ReactDOMServer.renderToString(Component)
            const initialState = apollo.extract()

            res.send(content)
        })
    }
}