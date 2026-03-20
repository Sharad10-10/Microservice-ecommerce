const mongoose = require('mongoose')

const connectDB = async()=> {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("MongoDB connected successfully for analytic service")
    } catch (error) {
        console.log("MongoDB connection failed for analytic service", error)
        process.exit(1)
    }
}

module.exports = connectDB;


