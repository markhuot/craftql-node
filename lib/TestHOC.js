const React = require('react')

module.exports = function (WrappedComponent) {
    return class extends React.Component {
        render() {
            return React.createElement('div', {className: "this-is-my-test"}, React.createElement(WrappedComponent, null))
        }
    }
}