const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./db/dbConfig')
const { connectKafka } = require('./kafka/kafka')


dotenv.config()


const app = express()
const port = process.env.PORT;

app.use(cors({origin: 'http://localhost:3000'}))
connectDB()
connectKafka()


app.listen(port, ()=> {
    console.log('Analytic service is running at http://localhost:',port)
})