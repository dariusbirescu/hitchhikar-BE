const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserSchema = new Schema({
     firstName: {
         type: String,
         required: true
     },
     lastName:{
         type: String,
         required: true
     },
     email:{
         type: String,
         required: true
     },
     password: {
         type: String,
         required: true
     },
     date:{
         type: Date,
         default: Date.now
     },
     birthday:{
         type: Date,
         default: Date.now
     },
     title:{
         type: String,
         default: 0
     },
     rentals:{
        type: Array
     }
})

module.exports = User = mongoose.model('users', UserSchema)