const express = require('express')
let db = require('../models')
const router = express.Router()


router.get('/signup', (req, res) => {
    res.render('auth/signup.ejs')
})

router.post('/signup', (req, res) => {
    // find or create a new user
    db.user.findOrCreate({
        where: {
            email: req.body.email
        },
        defaults: {
            name: req.body.name,
            password: req.body.password
        }
    })
    .then(([user, wasCreated]) => {
        if(wasCreated){
            res.send(`Created a new user profile for ${user.email}`)
        } else {
            res.send('Email exists')
        }
    })
})

router.get('/login', (req, res) => {
    res.render('auth/login.ejs')
})

router.post('/login', (req, res) => {
    db.user.findOne({
        where: {
            email: req.body.email,
            password: req.body.password
        }
    })
    .then(foundUser => {
        if(foundUser){
            res.send(`Logged in the following user: ${foundUser.name}`)
        } else {
            res.send('Try signing up!')
        }
    })
    .catch(err => {
        console.log('There was an error logging in. Check the console!')
    })
})

router.get('/logout', (req, res) => {
    res.redirect('/')
})

module.exports = router