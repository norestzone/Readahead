const passport = require('passport')
const db = require('../models')
const LocalStrategy = require('passport-local')

// ----> SERIALIZATION SET UP <----

// tell passport to serialize the user using
// the id by pass it in to the doneCallback
passport.serializeUser((user, doneCallback) => {
    console.log('serializing the user')
    doneCallback(null, user.id)
})

// tells passport how to deserialize the user now by looking it up in
// the database based on the information stored in the session
passport.deserializeUser((id, doneCallback) => {
    db.user.findByPk(id)
    .then(foundUser=>{
        console.log('deserializing user')
        doneCallback(null, foundUser)
    })
    .catch(err=>{
        console.log('ERROR deserializing user')
    })
})

// ----> STRATEGY SET UP <----

const findAndLogInUser = (email, password, doneCallback) => {
    // tell passport how to check our user is valid
    db.user.findOne({where:{email:email}}) // checks for user in db with that email
    .then(async foundUser => {
        let match
        if(foundUser) {
            // check the password is valid
            match = await foundUser.validPassword(password)
        }
        if(!foundUser || !match) { // there's something wrong with user
            console.log('password was NOT validated, i.e. password was false')
            return doneCallback(null, false)
        } else { // user is valid
            return doneCallback(null, foundUser)
        }
    })
    .catch(err=>doneCallback(err))
}
/* think of doneCallback as a function that looks like this:
login(error, userToBeLoggedIn) {
    // do stuff
}
we provide "null" is there's no error, or "false" if there's no user or if the password is invalid (like they did in the passport-local docs)
*/

const fieldsToCheck = {
    usernameField: 'email',
    passwordField: 'password'
}


// Create an instance of Local Strategy
// --> constructor arg 1:
// an object that indicates how we're going to refer to the two fields
// we're checking (for example we're using email instead of password)
// a callback that is ready to receive the two fields we're checking
// as well as a doneCallback

const strategy = new LocalStrategy(fieldsToCheck, findAndLogInUser)

passport.use(strategy)


// chunk version
// passport.use()

module.exports = passport