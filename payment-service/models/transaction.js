const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    orderId:{type:String, required: true, index: true},
    amount: Number,
    status: {
        type: String,
        enum: ['SUCCESS', 'FAILED'],
        required: true
    },
    createdAt: {type:Date, default: Date.now}
})

module.exports = mongoose.model('Transaction', transactionSchema)