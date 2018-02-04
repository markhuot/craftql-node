const express = require('express')
const app = express()
const craftql = require('./lib/craftql')

// craftql.addHigherOrderComponent(require('./lib/TestHOC'))

app.use(express.static('./public'))
app.use(craftql.routing)
app.use(craftql.middleware)

app.listen(3000, () =>
    console.log('Example app listening on port 3000!'))