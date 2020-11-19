const config = require('./config')
const router = require('./router')
const express = require('express')
const bodyParser = require('body-parser')
const queries = require('./queries')
const app = express()

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.get('/', (request, response) => {
    response.json({ info: 'JWT Authentication API with Node.js, Express, and Postgres API' })
})

router.set(app);

app.listen(config.port, () => {
    console.log(`App running on port ${config.port}.`)
    queries.initDatabase();
    queries.getNow().then(
        (result) => console.log('fine: ' + result.rows[0].now), 
        (err) => console.error('Error executing query', err.stack)
    );
    
})