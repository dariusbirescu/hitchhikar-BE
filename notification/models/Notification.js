const mongoose = require("mongoose")
const Schema = mongoose.Schema

const NotificationSchema = new Schema({
     renterer: {
         type: String,
         required: true
     },
     rentee:{
         type: String,
         required: true
     },
     from:{
        type: Date,
        default: Date.now
     },
     to: {
        type: Date,
        default: Date.now
     },
     car:{
         type: String,
         required: true
     }
})

module.exports = Notification = mongoose.model('notifications', NotificationSchema)