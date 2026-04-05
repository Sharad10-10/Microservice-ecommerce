// const mongoose = require('mongoose')

// const connectDB = async()=> {
//     try {
//         await mongoose.connect(process.env.MONGO_URL)
//         console.log("MongoDB connected successfully for payment service")
//     } catch (error) {
//         console.log("MongoDB connection failed for payment service", error)
//         process.exit(1)
//     }
// }

// module.exports = connectDB;


const mongoose = require('mongoose')

const connectDB = async () => {
  try {
   
    const paymentDB = mongoose.createConnection(process.env.PAYMENT_MONGO_URL)


    const cartDB = mongoose.createConnection(process.env.CART_MONGO_URL)


    cartDB.on('connected', () => {
      console.log('Cart Db connected')
    })

    paymentDB.on('connected', () => {
      console.log('Payment Db connected')
    })

    paymentDB.on('error', (err) => {
      console.error('Payment Db error:', err)
    })

    cartDB.on('error', (err) => {
      console.error('Cart Db error:', err)
    })

    return { cartDB, paymentDB }

  } catch (error) {
    console.error('DB Connection Failed:', error.message)
    process.exit(1)
  }
}

module.exports = connectDB