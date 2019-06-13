const express = require("express")
const cars = express.Router()
const cors = require("cors")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const Car = require("../models/Car")
cars.use(cors())

process.env.SECRET_KEY = 'secret'

cars.post('/add', (req, res) => {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const carData = {
        ABS: req.body.ABS,
        ESP: req.body.ESP,
        Automatic: req.body.Automatic,
        RearDefogger: req.body.RearDefogger,
        ParkingSensors: req.body.ParkingSensors,
        AC: req.body.AC,
        RearAirbags: req.body.RearAirbags,
        CentralLocking: req.body.CentralLocking,
        OnBoardComputer: req.body.OnBoardComputer,
        HeadsUpDisplay: req.body.HeadsUpDisplay,

        manufacturer: req.body.manufacturer,
        type: req.body.type,
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
    carData.blockedDates = [
        {
            start: new Date(),
            end: carData.availableFrom
        },
        {
            start: carData.availableTo,
            end: new Date('2030-05-13 08:00:00')
        }]
    console.log("ADDDD >>>>>>>>>>>>>>>>>>> ",req.body);
    carData.owner = decoded.email;
    Car.create(carData)
        .then(car => {
            console.log(car);
            return res.json(car._id)
        })
        .catch(err => {
            console.log(err);
            return res.send('error' + err)
        })
})

cars.get('/allCars', (req, res) => {
    Car.find().then(cars => {
        res.send(cars);
    })
})

cars.post('/update', (req, res) => {
    jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const carData = {
        ABS: req.body.ABS,
        ESP: req.body.ESP,
        Automatic: req.body.Automatic,
        RearDefogger: req.body.RearDefogger,
        ParkingSensors: req.body.ParkingSensors,
        AC: req.body.AC,
        RearAirbags: req.body.RearAirbags,
        CentralLocking: req.body.CentralLocking,
        OnBoardComputer: req.body.OnBoardComputer,
        HeadsUpDisplay: req.body.HeadsUpDisplay,

        manufacturer: req.body.manufacturer,
        model: req.body.model,
        type: req.body.type,
        year: req.body.year,
        price: req.body.price,
        lat: req.body.lat,
        lng: req.body.lng,
        seats: req.body.seats,
        extras: req.body.extras,
        availableFrom: req.body.availableFrom,
        availableTo: req.body.availableTo
    }

    carId = req.body._id;
    console.log("REQ BODY",req.body);
    return Car.findOne({
        _id: carId
    })
        .then(car => {
            if (car) {
                console.log("adasdasd");
                let blockedDates = car.blockedDates;
                if (car.availableFrom != req.body.availableFrom) {
                    blockedDates[0].start = req.body.availableFrom;
                }
                if (car.availableTo != req.body.availableTo) {
                    blockedDates[1].start = carData.availableTo;
                }
                car = carData;
                car.blockedDates = blockedDates;

                carId = req.body._id;
                let query = { '_id': carId };
                Car.findOneAndUpdate(query, car, { new: true }, function (err, doc) {
                    if (err) return res.send(500, { error: err });
                    return res.send("succesfully saved" + carData);
                });
            }else{
                return res.send(500);
            }
        })
})

cars.post('/rent', (req, res) => {

    carId = req.body.carId;
    rentFrom = req.body.rentFrom;
    rentTo = req.body.rentTo;

    Car.findOne({
        _id: carId
    })
        .then(car => {
            if (car) {
                let blockedDates = car.blockedDates;
                blockedDates.push({start: rentFrom, end: rentTo})
                car.blockedDates = blockedDates;
                carId = req.body.carId;
                let query = { '_id': carId };
                Car.findOneAndUpdate(query, car, { new: true }, function (err, doc) {
                    if (err) return res.send(500, { error: err });
                    return res.send("succesfully updated");
                });
            }
        })
})

cars.get('/details/:id', (req, res) => {
    carId = req.params.id;
    console.log(carId);
    Car.findOne({
        _id: carId
    })
        .then(car => {
            if (car) {
                console.log(car);
                let query = { '_id': carId };
                const updatedCarWithViews = car;
                updatedCarWithViews.views = car.views + 1;
                Car.findOneAndUpdate(query, updatedCarWithViews, { new: true }, function (err, doc) {
                    if (err) return res.send(500, { error: err });
                    return res.json(updatedCarWithViews);
                });
            } else {
                return res.err("did not find car");
            }
        })
})

cars.get('/recommendations', (req, res) => {
    carId = req.params.id;
    Car.find({
        _id: carId
    })
    Car.find().sort({ views: -1 }).limit(3).then(cars => {
        if (cars) {
            res.send(cars);
        } else {
            res.err("no cars found");
        }

    })

})

cars.post('/carsInArea', (req, res) => {
    console.log(req.body.minLat + " " + req.body.maxLat + " " + req.body.minLng + " " + req.body.maxLng)
    Car.find().where('lat').gt(req.body.minLat).lt(req.body.maxLat)
        .where('lng').gt(req.body.minLng).lt(req.body.maxLng).exec((err, cars) => {
            if (err) { console.log(err); return handleError(err); }
            if (cars) {
                res.send(cars);
            } else {
                res.err("no cars found");
            }

        })
    res.status(200);

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