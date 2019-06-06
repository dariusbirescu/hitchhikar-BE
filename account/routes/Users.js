const express = require("express")
const users = express.Router()
const cors = require("cors")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const axios = require("axios")

const User = require("../models/User")
users.use(cors())

process.env.SECRET_KEY = 'secret'

users.post('/register', (req, res) => {
    const today = new Date()
    const userData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        title: '',
        birthday: '',
        created: today
    }

    User.findOne({
        email: req.body.email
    })
        .then(user => {
            if (!user) {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    userData.password = hash
                    User.create(userData)
                        .then(user => {
                            res.status(201).json({ status: user.email + 'registered!' })
                        })
                        .catch(err => {
                            res.send('error' + err)
                        })
                })
            } else {
                res.status(400).json({ error: 'User already exists' });
            }
        })
        .catch(err => {
            res.send('error' + err)
        })
})

users.post('/login', (req, res) => {
    User.findOne({
        email: req.body.email
    })
        .then(user => {
            if (user) {
                if (bcrypt.compareSync(req.body.password, user.password)) {
                    const payload = {
                        _id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        title: user.title,
                        birthday: user.birthday,
                        email: user.email
                    }
                    let token = jwt.sign(payload, process.env.SECRET_KEY, {
                    })
                    res.send(token)
                } else {
                    res.status(401).json({ error: "User does not exist" })
                }
            } else {
                res.status(401).json({ error: "User does not exist" })
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })

})


users.post('/profile', (req, res) => {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    const userData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        title: req.body.title,
        birthday: req.body.birthday
    }

    User.findOne({
        email: req.body.email
    })
        .then(user => {
            if (!user || user.email === decoded.email) {
                userId = decoded._id;
                let query = { '_id': userId };
                const password = req.body.password;
                if (password && password !== "") {
                    bcrypt.hash(password, 10, (err, hash) => {
                        userData.password = hash
                        User.findOneAndUpdate(query, userData, { new: true }, function (err, doc) {
                            if (err) return res.send(500, { error: err });
                            userData._id = decoded._id;
                            let token = jwt.sign(userData, process.env.SECRET_KEY, {})
                            return res.send(token)
                        });
                    })
                } else {
                    User.findOneAndUpdate(query, userData, { new: true }, function (err, doc) {
                        if (err) return res.send(500, { error: err });
                        userData._id = decoded._id;
                        let token = jwt.sign(userData, process.env.SECRET_KEY, {})
                        return res.send(token)
                    });
                }
            } else {
                res.status(400).json({ error: 'User already exists' });
            }
        })
        .catch(err => {
            res.send('error' + err)
        })
})


users.get('/cars', (req, res) => {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    User.findOne({
        _id: decoded._id
    })
        .then(user => {
            if (user) {
                return axios
                    .get('http://localhost:5001/cars/userCars/' + decoded.email)
                    .then(response => {
                        res.status(200).json(response.data);
                        return res.data;
                    })
                    .catch(err => {
                        res.send(err);
                    })
            }
        })
        .catch(err => {
            res.send('could not find user' + err)
        })
})

users.post('/pastCars', (req, res) => {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    User.findOne({
        _id: decoded._id
    })
        .then(user => {
            if (user) {
                pastTrips=user.rentals.filter(rental => {
                    let date=new Date(rental.start);
                    return new Date() > date;
                })
                return res.status(200).json(pastTrips);
            }
        })
        .catch(err => {
            res.send('could not find user' + err)
        })
})

users.post('/futureCars', (req, res) => {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    User.findOne({
        _id: decoded._id
    })
        .then(user => {
            if (user) {
                pastTrips=user.rentals.filter(rental => {
                    let date=new Date(rental.rentFrom);
                    return new Date() < date;
                })

                return res.status(200).json(pastTrips);
            }
        })
        .catch(err => {
            res.send('could not find user' + err)
        })
})

users.post('/cars', (req, res) => {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    User.findOne({
        _id: decoded._id
    })
        .then(user => {
            if (user) {
                return axios
                    .get('http://localhost:5001/cars/userCars/' + decoded.email)
                    .then(response => {
                        res.status(200).json(response.data);
                        return res.data;
                    })
                    .catch(err => {
                        res.send(err);
                    })
            }
        })
        .catch(err => {
            res.send('could not find user' + err)
        })
})

users.post('/rent', (req, res) => {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    carId = req.body.carId;
    rentFrom = req.body.startDate;
    rentTo = req.body.endDate;

    User.findOne({
        _id: decoded._id
    })
        .then(user => {
            let query = { '_id': decoded._id };
            userRentals = user.rentals;
            userRentals.push({ rentFrom: req.body.startDate, rentTo: req.body.endDate, carId: req.body.carId })

            user.rentals = userRentals;
            User.findOneAndUpdate(query, user, { new: true }, function (err, doc) {
            }).then(userResponse =>{
            return axios
                .post('http://localhost:5001/cars/rent',{carId,rentFrom,rentTo})
                .then(response => {
                    res.status(200).json(response.data);
                    return res.data;
                })
                .catch(err => {
                    console.log(err);
                    res.send(err);
                })
            });

        })
        .catch(err => {
            res.send('could not find user' + err)
        })
})

module.exports = users