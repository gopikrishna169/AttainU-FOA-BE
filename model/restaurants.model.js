const mongoose = require('mongoose')

const restaurantsSchema = new mongoose.Schema({
    resturantId: {
        type: Number,
        required: true
    },
    cuisines: {
        type: Array,
        required: true
    },
    location: {
        type: String,
        required: true
    }
})

const cuisineSchema = new mongoose.Schema({
    cuisineId: {
        type: Number,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('restaurants', restaurantsSchema)