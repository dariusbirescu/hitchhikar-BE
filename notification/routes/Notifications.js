const express = require("express")
const notifications = express.Router()
const cors = require("cors")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const axios = require("axios")

const Notification = require("../models/Notification")
notifications.use(cors())

process.env.SECRET_KEY = 'secret'

notifications.post('/notify', (req,res) => {
    const notificationData = {
        from: req.body.from,
        to: req.body.to,
        rentee: req.body.rentee,
        renterer: req.body.renterer,
        car: req.body.car
    }

    Notification
        .create(notificationData)
        .then(notification => {
            console.log(notification);
            return res.json(notification._id)
        })
        .catch(err => {
            console.log(err);
            return res.send('error' + err)
        })

})


notifications.post('/getNotification', (req,res) => {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const email = decoded.email;
    console.log(email);
    Notification.find({
        'rentee': email,
    })
    .then(notifications => {
        console.log(notifications);
        return res.json(notifications.reverse())
    })
    .catch(err => {
        console.log(err);
        return res.send('error' + err)
    })

})


// users.post('/register', (req, res) => {
//     const today = new Date()
//     const userData = {
//         firstName: req.body.firstName,
//         lastName: req.body.lastName,
//         email: req.body.email,
//         password: req.body.password,
//         title: '',
//         birthday: '',
//         created: today
//     }

//     User.findOne({
//         email: req.body.email
//     })
//         .then(user => {
//             if (!user) {
//                 bcrypt.hash(req.body.password, 10, (err, hash) => {
//                     userData.password = hash
//                     User.create(userData)
//                         .then(user => {
//                             res.status(201).json({ status: user.email + 'registered!' })
//                         })
//                         .catch(err => {
//                             res.send('error' + err)
//                         })
//                 })
//             } else {
//                 res.status(400).json({ error: 'User already exists' });
//             }
//         })
//         .catch(err => {
//             res.send('error' + err)
//         })
// })

module.exports = notifications