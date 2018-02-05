import React, { Component as BaseComponent } from 'react'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class Destinations extends BaseComponent {
    render() {
        return (
            <ul>
                {this.props.data.entries.map((entry) => (
                    <li key={entry.id}><a href={entry.uri}>{entry.title}</a></li>
                ))}
            </ul>
        )
    }
}

const query = gql`
    query EntriesQuery {
        entries {
            id
            title
            uri
        }
    }
`

export default graphql(query, {})(Destinations);