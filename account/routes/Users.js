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
        gender: '',
        birthday: '',
        created: today
    }

    User.findOne({
        email: req.body.email
    })
        .then(user => {
            console.log(user);
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
                        gender: user.gender,
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
        password: req.body.password,
        gender: req.body.gender,
        birthday: req.body.birthday
    }

    User.findOne({
        _id: decoded._id
    })
        .then(user => {
            if (user) {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    userData.password = hash
                    User.update(userData)
                        .then(user => {
                            res.status(200).json({ user })
                        })
                        .catch(err => {
                            res.send('error' + err)
                        })
                })
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
                        console.log(err);
                        res.send(err);
                    })
            }
        })
        .catch(err => {
            res.send('could not find user' + err)
        })
})

module.exports = users