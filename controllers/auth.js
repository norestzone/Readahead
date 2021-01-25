const express = require('express')
let db = require('../models')
const router = express.Router()
const passport = require('../config/ppConfig.js')


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
            passport.authenticate('local', {
                successRedirect: '/',
                successFlash: 'Account created! User is logged in.'
            })(req, res) // IIFE
            res.send(`Created a new user profile for ${user.email}`)
        } else {
            req.flash('error', 'An account associated with that email already exists.')
            res.redirect('/auth/login')
        }
    })
    .catch(err=>{
        req.flash('error', err.message)
    })
})

router.get('/login', (req, res) => {
    res.render('auth/login.ejs')
})

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/auth/login',
    successRedirect: '/',
    successFlash: 'You are now logged in!',
    failureFlash: 'Oops! Invalid email or password, please try again.'
}))

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

module.exports = router