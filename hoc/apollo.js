import { withData } from 'next-apollo'
import { graphql } from 'react-apollo'
import { HttpLink } from 'apollo-link-http'

export const apolloConfig = {
    link: new HttpLink({
        uri: 'http://dev.craftql.com/api',
        headers: {
            authorization: 'bearer XEPgis11KSTmFcGcAUFSwSQWKVQO_hn-w8lycadmnItQSQw4mUU1amBIt0dQtAta'
        }
    })
}

export default Component =>
    withData(apolloConfig)(Component)