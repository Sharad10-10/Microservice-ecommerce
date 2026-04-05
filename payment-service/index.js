const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./db/dbConfig')
const {connectKafka }= require('./kafka/kafka')
const webhookRoute = require('./routes/webhook')
const checkoutRoute = require('./routes/checkout')

dotenv.config()

const app = express()
const port = process.env.PORT;

app.use(cors({origin: 'http://localhost:3000'}))

app.use(express.json())

app.use('/webhook', webhookRoute)

connectDB()
connectKafka()

app.use('/checkout', checkoutRoute)

app.listen(port, ()=> {
    console.log('Payment service is running at http://localhost:',port)
})