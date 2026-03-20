const mongoose = require('mongoose')

const eventLogSchema = new mongoose.Schema({
    eventType: String,  // store order created, payment processed?
    payload: Object,   // store the entire payload message
    occurredAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('EventLog', eventLogSchema)