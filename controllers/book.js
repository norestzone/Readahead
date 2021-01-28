const express = require('express')
let db = require('../models')
const router = express.Router()
const passport = require('../config/ppConfig.js')


// Selected book information
// router.get('/:isbn', (req, res) => {
//     let headers = {
//         "Content-Type": 'application/json',
//         "Authorization": process.env.API_KEY
//     }
//     console.log(req.params)     
//     axios.get(`https://api2.isbndb.com/book/${req.params.isbn}`, {headers: headers})
//         .then(json => {
//             console.log(json.data)
//             res.render('details', {book:json.data.book})
//             // res.json(json.data)
//         })
//         .catch(error => {
//             console.error('Error:', error)
//         });
// })

// Comments -> unfinished
// router.post('/:isbn/comments', (req, res) => {
//     console.log('comments reached')
// })

// Post a comment -> unfinished
// router.post('/comments/:id', (req, res) => {
//     db.book.findOne({
//       where: { id: req.params.id },
//       include: [db.author, db.comment]
//     }).then(book => {
//       book.createComment({
//         name: req.body.name,
//         content: req.body.content
//       }).then(comment => {
//         res.send(`/articles/${req.params.id}`)
//       })
//     })
//   })