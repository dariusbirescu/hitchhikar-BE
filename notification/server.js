var express = require('express')
var cors = require("cors")
var bodyParser = require("body-parser")
var app = express()
var mongoose = require("mongoose")
var port = process.env.PORT || 5002

app.use(bodyParser.json())
app.use(cors())
app.use (
    bodyParser.urlencoded({
        extended:false
    })
)

const mongoURI='mongodb://localhost:27019/notifcation'


mongoose
    .connect(mongoURI, {useNewUrlParser:true})
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err))

var Notifications= require('./routes/Notifications')

app.use('/notifications', Notifications)

app.listen(port, () => {
    console.log("Server is running on port: "+port)
})