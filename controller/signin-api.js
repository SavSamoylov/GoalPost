const express = require('express')
const bcrypt = require('bcryptjs')

// Requiring our models
let db = require("../models")

let router = express.Router()

// User SIGNIN POST Routes
router.post('/', (req, res)=>{

  // Validator
  req.checkBody('loginEmail', 'Please enter a valid email address.').isEmail()
  req.checkBody('loginEmail', 'Email field is required.').notEmpty()
  req.checkBody('loginPassword', 'Password is required.').notEmpty()


  // Check Errors
  req.getValidationResult()
  .then(function(result){

    let errors = result.array();

    if (errors.length > 0){

      let error_message = errors;

      res.render('login', {error_message: error_message})

    } else {

      let user = {
        email: req.body.loginEmail,
        password: req.body.loginPassword
      }

      // Check if user email is in the database.
      checkEmail(user.email, function(email){
        if(!email){

          let error_message = {
            error_message: {
              msg: "Invalid Email or Password. Please make sure that you have entered all information correctly."
            }
          }

          res.render('login', {error_message: error_message})

        } else {
          console.log("THAT USER DOES EXIST!")

          checkPassword(user, function(result, userId){
            if(!result){

              let error_message = {
                error_message: {
                  msg: "Invalid Email or Password. Please make sure that you have entered all information correctly."
                }
              }

              res.render('login', {error_message: error_message})

            } else {

              req.session.userId = userId;
              let cookieId = res.cookie('cookieId', userId)
              console.log("USER ID ", userId)
              console.log("SESSION ", req.session.userId)
              console.log("COOKIE ", req.cookies.cookieId)
              res.redirect('/users/profile/'+ req.session.userId)

            }
          })

        }
      })



    }

  })


});

// Helper Functions
// -------------------------------------------------------------

function checkEmail(email, callback){
  db.user.findOne({where:{email:email}})
  .then(function(data){
    if(!data){
      callback(false)
    } else {
      callback(true)
    }
  })
}

function checkPassword(userObj, callback){
  db.user.findOne({where:{email:userObj.email}})
  .then(function(userData){
    bcrypt.compare(userObj.password, userData.password, function(err, isMatch) {
      // isMatch === true
      if (isMatch){
        callback(isMatch, userData.id)
      } else {
        callback(false, null)
      }

    });
  })

}

module.exports = router;
