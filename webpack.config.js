const path = require('path')
const glob = require("glob")

var entries = {}
var templates = glob.sync("./templates/**/*.js")
for (var i=0,len=templates.length; i<len; i++) {
    const basename = path.basename(templates[i]).replace(/\.js$/, '')
    entries[templates[i].replace(/^\.\/templates\//, '').replace(/\.js$/, '')] = path.resolve(templates[i])
}

module.exports = {
    entry: entries,
    output: {
        filename: "[name].js",
        path: "/", //path.resolve(__dirname, "public"),
        libraryTarget: "commonjs2"
    },
    target: "node",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
    }
}