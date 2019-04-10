const express = require("express")
const cars = express.Router()
const cors = require("cors")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const Car = require("../models/Car")
cars.use(cors())

process.env.SECRET_KEY = 'secret'

cars.post('/upsert', (req, res) => {
    const carData = {
        id: req.body.id,
        manufacturer: req.body.manufacturer,
        model: req.body.model,
        year: req.body.year,
        seats: req.body.seats,
        extras: req.body.extras,
        owner: req.body.owner,
        image: today
    }

    Car.findOne({
        id: req.body.id
    }).then(car => {
        if (!car) {
            Car.create(carData)
                .then(car => {
                    res.json('new car added!')
                })
                .catch(err => {
                    res.send('error' + err)
                })
        } else {
            var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
            User.findOne({
                _id: decoded._id
            })
                .then(user => {
                    if (car.owner === user.email) {
                        Car.update(carData)
                            .then(car => {
                                res.json('car updated')
                            })
                            .catch(err => {
                                res.send('error' + err)
                            })
                    }
                })
        }
    })
        .catch(err => {
            res.send('error' + err)
        })
})

cars.get('/details/:id', (req, res) => {
    Car.findOne({
        id: req.params.id
    })
        .then(car => {
            res.json(car)
        })
        .catch(err => {
            res.send('error' + err)
        })

        .catch(err => {
            res.send('error' + err)
        })
})

module.exports = cars