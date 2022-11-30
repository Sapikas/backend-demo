const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    dietAgency : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'dietAgency'
        }
    ],
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "supervisor", "admin"]
    },
    street: {
        type: String,
        default: ''
    },
    apartment: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    zip: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: ''
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    diets: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'diets'
        }
    ]
});

const User = mongoose.model('User', userSchema)

module.exports = User;