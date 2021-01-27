require('dotenv').config() // configure environment variables
const { render } = require('ejs')
const { response } = require('express')
const express = require('express')
const ejsLayouts = require('express-ejs-layouts')
const app = express()
const session = require('express-session')
const passport = require('./config/ppConfig.js')
const flash = require('connect-flash')
const isLoggedIn = require('./middleware/isLoggedIn')

// set the view engine to ejs
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false }))

// session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true 
}))

// tell the app to use ejs layouts
app.use(ejsLayouts)

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

// flash middleware
app.use(flash())

// custom middleware
app.use((req,res, next)=>{
    // before every route, attach the flash messages and current user to res.locals
    res.locals.alerts = req.flash()
    res.locals.currentUser = req.user
    next() // move on to the next piece of middleware
})

// controller middleware
app.use('/auth', require('./controllers/auth.js'))

// ADDED CSS
app.use(express.static(__dirname + '/public'));

// Routes
app.get('/', (req, res) => {
    res.render('home')
})


app.get('/profile',isLoggedIn, (req, res) => {
    res.redirect('profile')
})

app.get('*', (req, res)=>{
    res.render('404')
})


// ---- NEW ROUTES ----

// Route to User Profile
// app.get('/home', (req, res) => {
//     res.send('profile')
// })

// Route to book search results
app.get('/results', (req, res) => {
    res.send('you have reached the book search results')
})

// Route to a spcific book's details
app.get('/books/:id', (req, res) => {
    res.send('you have reached the details for a specific book')
    .catch((error) => {
    })
})

// Route to book details
app.get('/details', (req, res) => {
    res.send('you have reached the book details')
})


app.listen(process.env.PORT, () => {
    console.log(`Project 2 is running on ${process.env.PORT}`)
})