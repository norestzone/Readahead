module.exports = (req, res, next) => {
    if(!req.user) {
        req.flash('error', 'You must be logged in to see cool things.')
        res.redirect('/auth/login')
    } else {
        next()
    }
}