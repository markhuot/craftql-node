import React, { Component as BaseComponent } from 'react'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class Component extends BaseComponent {
    render() {
        return (
            <h1>Hello world! id: {this.props.data.entry.title}</h1>
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

const options = ({ entryId }) => {
    return ({
        variables: {
            id: entryId
        }
    })
}

export default graphql(query, {options})(Component);