const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDb = require('./db/dbConfig')
const userRoutes = require('./routes/userRoutes')
const { connectKafka }= require('./kafka/kafka');
const cookieParser = require('cookie-parser');

dotenv.config()

const app = express()



app.use(express.json())

app.use(cookieParser())

app.use(cors({origin: 'http://localhost:3000', credentials: true}))

connectDb()

connectKafka()


app.use('/api/auth-service', userRoutes)

const Port = process.env.PORT;

app.listen(Port, ()=> {
    console.log('Auth service is running at http:localhost:',Port)
})

