const ApolloClient = require('apollo-client').ApolloClient
const HttpLink = require('apollo-link-http').HttpLink
const InMemoryCache = require('apollo-cache-inmemory').InMemoryCache
const fetch = require('node-fetch')

module.exports = new ApolloClient({
    link: new HttpLink({
        uri: 'http://dev.craftql.com/api',
        headers: {
            authorization: 'bearer XEPgis11KSTmFcGcAUFSwSQWKVQO_hn-w8lycadmnItQSQw4mUU1amBIt0dQtAta'
        },
        fetch,
    }),
    cache: new InMemoryCache(),
});