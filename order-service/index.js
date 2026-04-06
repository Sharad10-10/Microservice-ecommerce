const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./db/dbConfig')
const {connectKafka} = require('./kafka/kafka')
const orderRoutes = require('./routes/order')

dotenv.config()


const app = express()
const port = process.env.PORT;

app.use(cors({origin: 'http://localhost:3000'}))
app.use(express.json())
connectDB()
connectKafka()

app.use('/api/orders', orderRoutes)

app.listen(port, ()=> {
    console.log('Order service is running at http://localhost:',port)
})