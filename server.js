const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')

require('dotenv').config()

//routes imports 
const accountRoute = require('./routes/account')
const categoryRoute = require('./routes/categories')
const drugsRoute = require('./routes/drugs')




const app = express()

app.use(cors())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

const mongo = process.env.MONGO_URI
mongoose
  .connect(mongo, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MoongoDB Connected successfully'))
  .catch(err => console.log(err))

  //routes
app.use('/account', accountRoute)
app.use('/category', categoryRoute)
app.use('/drug', drugsRoute)

const port = process.env.PORT || 3000

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))