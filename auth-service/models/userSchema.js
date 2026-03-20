const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    verificationToken: String,
    refreshToken: String
})

module.exports = mongoose.model('User', userSchema)