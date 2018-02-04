import React, { Component as BaseComponent } from 'react'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class Component extends BaseComponent {
    render() {
        console.log('data is', this.props.data)

        return (
            <h1>Hello world!</h1>
        )
    }
}

const query = gql`
    query EntryQuery($id: [Int]) {
        entry(id: $id) {
            id
            title
        }
    }
`

const options = { options: {
    variables: {
        id: 6
    }
}}

export default graphql(query, options)(Component);