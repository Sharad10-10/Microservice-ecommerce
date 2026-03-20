const mongoose = require('mongoose')

const connectDb = async()=> {
    try {
            await mongoose.connect(process.env.MONGO_URL)
            console.log("Mongo db connection successfully for cart service")

    } catch (error) {
        console.log('Failed to connect to cart service db')
    }
}

module.exports = connectDb