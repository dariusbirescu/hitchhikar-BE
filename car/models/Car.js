const mongoose = require("mongoose")
const Schema = mongoose.Schema

const CarSchema = new Schema({
    owner: {
        type: String
    },
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
    year: {
        type: Date,
        default: Date.now
    },
    seats: { type: Number, min: 1, max: 32 },
    img:
        { data: Buffer, contentType: String }

})

module.exports = Car = mongoose.model('cars', CarSchema)