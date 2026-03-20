const mongoose = require('mongoose')

const connectDB = async()=> {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("MongoDB connected successfully for email service")
    } catch (error) {
        console.log("MongoDB connection failed for email service", error)
        process.exit(1)
    }
}

module.exports = connectDB;


