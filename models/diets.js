const mongoose = require('mongoose');

const dietsSchema = mongoose.Schema({
    Dietitians:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dietAgency',
        required: true
    },
    email:{
        type: String,
        required: true
    },
    diets :[
        {
            name: String,
            values: mongoose.Schema.Types.Array
        }
    ]
});

const Diets = mongoose.model('Diets', dietsSchema);

module.exports = Diets;