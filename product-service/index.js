const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./db/dbConfig')
const productRoutes = require('./routes/products')

dotenv.config()


const app = express()
const port = process.env.PORT;

app.use(cors({origin: 'http://localhost:3000'}))
connectDB()


app.use('/api/products', productRoutes)

app.listen(port, ()=> {
    console.log('Product service is running at http://localhost:',port)
})