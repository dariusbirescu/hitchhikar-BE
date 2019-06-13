var express = require('express')
var multer = require('multer');
var cors = require("cors")
var bodyParser = require("body-parser")
var app = express()
var mongoose = require("mongoose")
const config = require('./config');
var port = process.env.PORT || 5001

app.use(bodyParser.json())
app.use(cors())
app.use (
    bodyParser.urlencoded({
        extended:false
    })
)

const dbUrl = config.DB_URL;
const mongoURI='mongodb://localhost:27018/cars'

mongoose
    .connect(dbUrl, {useNewUrlParser:true})
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err))

var cars = require('./routes/Cars')

app.use('/cars', cars)

app.listen(port, () => {
    console.log("Server is running on port: "+port)
})