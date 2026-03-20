const mongoose = require('mongoose')

const emailLogSchema = new mongoose.Schema({
    orderId: String,
    recipient: {
        type: String,
        required: true
    },

    subject: {
        type: String,
        required: true
    },

    customerEmail: {
        type: String,
        required: true
    },

    body: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ['SENT', 'FAILED'],
        default: 'PENDING'        
    },
    timeStamp: {
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model('EmailLog', emailLogSchema)