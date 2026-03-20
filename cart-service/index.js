const express = require('express')
const cors = require('cors')
const connectDb = require('./db/dbConfig')
const cartRoutes = require('./routes/cartRoutes')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')


dotenv.config()
connectDb()

const port = process.env.PORT;

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }))





app.use('/api/cart-service', cartRoutes)

app.listen(port, ()=> {
    console.log('Cart service is running at http://localhost:',port)
})

