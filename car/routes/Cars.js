const express = require("express")
const cars = express.Router()
const cors = require("cors")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const Car = require("../models/Car")
cars.use(cors())

process.env.SECRET_KEY = 'secret'

cars.post('/add', (req, res) => {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const carData = {
        manufacturer: req.body.manufacturer,
        model: req.body.model,
        year: req.body.year,
        seats: req.body.seats,
        lat: req.body.lat,
        lng: req.body.lng,
        extras: req.body.extras,
        price: req.body.price,
        availableFrom: req.body.availableFrom,
        availableTo: req.body.availableTo,
        views: 0,
        owner: decoded.email
    }
    console.log(req.body);
    carData.owner = decoded.email;
    Car.create(carData)
        .then(car => {
            console.log(car);
            res.json(car._id)
        })
        .catch(err => {
            res.send('error' + err)
        })
})

cars.post('/update', (req, res) => {
    jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const carData = {
        manufacturer: req.body.manufacturer,
        model: req.body.model,
        year: req.body.year,
        lat: req.body.lat,
        lng: req.body.lng,
        seats: req.body.seats,
        extras: req.body.extras,
        availableFrom: req.body.availableFrom,
        availableTo: req.body.availableTo
    }
    Car.findOne({
        id: req.body.id
    }).then(car => {
        console.log(car);
        if (car) {
            Car.updateOne(carData)
                .then(car => {
                    res.json('new car updated!' + car._id);
                })
                .catch(err => {
                    res.send('error' + err)
                })
        } else {
            res.send('car does not exist')
        }
    })
        .catch(err => {
            res.send('error' + err)
        })
})

cars.get('/details/:id', (req, res) => {
    carId=req.params.id;
    Car.findOne({
        _id: carId
    })
        .then(car => {
            if (car) {
                let query = {'_id':carId};
                const updatedCarWithViews= car;
                updatedCarWithViews.views = car.views+1;
                Car.findOneAndUpdate(query, updatedCarWithViews, {new: true}, function(err, doc){
                    if (err) return res.send(500, { error: err });
                    return res.send("succesfully saved" +updatedCarWithViews);
                });
            } else {
                res.err("did not find car");
            }
        })
        .catch(err => {
            res.err('error' + err)
        })
})

cars.get('/recommendations', (req, res) => {
    Car.find().sort({ views: -1 }).limit(3).then(cars => {
        console.log(cars);
        if(cars){
            res.send(cars);
        }else{
            res.err("no cars found");
        }
        
    })

})

cars.get('/userCars/:userEmail', (req, res) => {
    Car.find({
        owner: req.params.userEmail
    })
        .then(cars => {
            if (cars) {
                    return res.status(200).json(cars);
            } else {
                res.err("did not find cars");
            }
        })
        .catch(err => {
            res.err('error' + err)
        })

})

cars.get('/image/:id', (req, res) => {
    var fs = require('fs');
    const path = require("path");
    var img = fs.readFileSync(path.resolve(__dirname, '../uploads/carPhoto-' + req.params.id));
    res.writeHead(200, { 'Content-Type': 'image/gif' });
    res.end(img, 'binary');
})

var multer = require('multer');


cars.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

cars.post('/api/photo/:carId', function (req, res) {

    console.log(req);
    var storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, './uploads');
        },
        filename: function (req, file, callback) {
            callback(null, file.fieldname + "-" + req.params.carId);
        }
    });

    var upload = multer({ storage: storage }).single('carPhoto');

    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});


module.exports = cars