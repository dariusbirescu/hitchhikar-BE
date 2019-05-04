const mongoose = require("mongoose")
const Schema = mongoose.Schema

const CarSchema = new Schema({
    owner: {
        type: String
    },
    lat: { type: Number },
    lng: { type: Number },

    id: {
        type: String
    },
    manufacturer: {
        type: String
    },
    model: {
        type: String,
        required: true
    },
    extras: {
        type: Array,
        required: true
    },
    views: {
        type: Number,
        required: false
    },
    year: {
        type: Number,
        default: 1970
    },
    price: {
        type: Number,
        required: true
    },
    availableFrom: {
        type: Date,
        default: Date.now
    },
    availableTo: {
        type: Date
    },
    seats: { type: Number, min: 1, max: 32 },
    img: { type: String }

})

module.exports = Car = mongoose.model('cars', CarSchema)