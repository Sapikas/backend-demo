const mongoose = require('mongoose')

const dietitianSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    isDietitians: {
        type: Boolean,
        default: false
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
    }
})

dietitianSchema.virtual('id').get(function(){
    return this._id.toHexString();
})

dietitianSchema.set('toJSON', {
    virtuals: true
})

const dietAgency = mongoose.model('dietAgency', dietitianSchema)

module.exports = dietAgency;