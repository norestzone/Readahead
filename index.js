require('dotenv').config() // configure environment variables
const axios = require('axios')
const { response } = require('express')
const express = require('express')
const ejsLayouts = require('express-ejs-layouts')
const app = express()

// set the view engine to ejs
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false }))
// tell the app to use ejs layouts
app.use(ejsLayouts)
// ADDED CSS
app.use(express.static(__dirname + '/public'));

// controller middleware
app.use('/auth', require('./controllers/auth.js'))


// Routes
app.get('/', (req, res) => {
  res.render('home.ejs')
})

app.get('/profile', (req, res) => {
  res.render('profile.ejs')
})

app.listen(process.env.PORT, () => {
    console.log(`Auth app is running on ${process.env.PORT}`)
})