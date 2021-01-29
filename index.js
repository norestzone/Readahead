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
const { default: axios } = require('axios')
const db = require('./models')
const methodOverride = require('method-override');

// set the view engine to ejs
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false }))

// method override
app.use(methodOverride('_method'));

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

// **** NEW ROUTES START ****

// Route to book search results
app.get('/results', (req, res) => {
    let headers = {
        "Content-Type": 'application/json',
        "Authorization": process.env.API_KEY
    }
         
    axios.get(`https://api2.isbndb.com/books/${req.query.name}`, {headers: headers})
        .then(json => {
            console.log(json.data)
            res.render('results', {books:json.data.books})
            // res.json(json.data)
        })
        .catch(error => {
            console.error('Error:', error)
        });
})

app.get('/book/:isbn', (req, res) => {
    let headers = {
        "Content-Type": 'application/json',
        "Authorization": process.env.API_KEY
    }
    console.log(req.params)     
    axios.get(`https://api2.isbndb.com/book/${req.params.isbn}`, {headers: headers})
        .then(json => {
            console.log(json.data)
            db.comment.findAll({
                where: {
                    bookId: req.params.isbn
                }
            }).then(comments => {
                res.render('details', {book:json.data.book, comments:comments})
            })
        })
        .catch(error => {
            console.error('Error:', error)
        });
})

// Create and add comment to thread
app.post('/book/:isbn/comments', isLoggedIn, (req, res) => {
    console.log('comments reached')
    db.comment.create({
        userId: req.user.id,
        bookId: req.params.isbn,
        comment: req.body.comment
    }).then((comments) => {
        res.redirect(`/book/${comments.bookId}`)
    })
})

// Edit comment in thread
app.put('/book/:isbn/comments', isLoggedIn, (req, res) => {
    db.comment.update({
        comment: req.body.comment
    }, {
        where: {
            userId: req.user.id,
            bookId: req.params.isbn
        }
    }).then(updated => {
        res.redirect(`/book/${req.params.isbn}`)
    })
})

// Delete comment from thread
app.delete('/book/:isbn/comments', isLoggedIn, (req, res) => {
    console.log('comments reached')
    db.comment.destroy({
        where: {
            userId: req.user.id,
            bookId: req.params.isbn,
        }   
    }).then((comments) => {
        res.redirect(`/book/${req.params.isbn}`)
    })
})

// **** NEW ROUTES END ****

// Routes
app.get('/', (req, res) => {
    res.render('home')
})


app.get('/profile',isLoggedIn, (req, res) => {
    res.render('profile')
})

app.get('*', (req, res)=>{
    res.render('404')
})

app.listen(process.env.PORT, () => {
    console.log(`Project 2 is running on ${process.env.PORT}`)
})