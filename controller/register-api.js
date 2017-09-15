const express = require('express')
var bcrypt = require('bcryptjs')

// Requiring our models
let db = require("../models")

let router = express.Router()


// User REGISTER POST Routes
router.post('/', (req, res)=>{

  // Validator
  req.checkBody("registrationName",'Name field is required').notEmpty();
  req.checkBody("registrationEmail",'Email field is required').notEmpty();
  req.checkBody("registrationEmail",'Email is not valid').isEmail();
  req.checkBody("registrationPassword",'Password field is required').notEmpty();


  // Check Errors
  req.getValidationResult()
  .then(function(result){

    let errors = result.array();


    if (errors.length > 0){

      console.log("------------ ERRORS:")
      console.log(errors)
      let error_message = errors;
      res.render('register', {error_message: error_message})

    } else {

      let newUser = {
        full_name: titleCase(req.body.registrationName).trim(),
        email: req.body.registrationEmail.trim(),
        password: hashPassword(req.body.registrationPassword, function(r){
          newUser.password = r.trim();
        }),
        color: getUserColor(),
      }

      // Check if User already exists.
      checkUser(newUser.email, function(r){
        if (r){
          console.log("Returned true. Can register user.")
          console.log(newUser)
          registerUser(newUser, function(name){

            let success_message = "Congratulations " + name + "! You can now Sign-in!"
            res.render('login', {success_message: success_message})


          })
        } else {
          console.log("Returned false. User already exists.")
          let error_message = {
            error_message:{
              msg: "It seems that a user with that email already has an account."
            }
          }

          res.render('register', {error_message: error_message})
        }

      })


    }

  });

})


// Helper Functions
// -------------------------------------------------------------
function titleCase(str) {
  var splitStr = str.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {

    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(' ');
}

function hashPassword(password, callback){
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
      let p = hash;
      callback(p);
    });
  });
}

function checkUser(email, callback) {
  db.user.findOne(
    {
      where:{
        email: email,
      }
    }
  ).then(function(user){

    if (!user){
      let r = true; // User not found. Proceed with registration.
      callback(r)
      console.log("NO USER")
    } else {
      let r = false; // User found. Can't register
      callback(r)
      console.log("YES USER")
    }

  })
}

function registerUser(userObj, callback){

  let usersFirstName = userObj.full_name.split(' ')[0].trim();

  db.user.create(userObj)
  .then(function(createdUser){
    callback(usersFirstName)
  })

}

function getUserColor(){

  let userColorArray = ['#dc3545', '#f44336', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffc107', '#ff9800', '#ff5722', '#607d8b']

  let randColor = userColorArray[Math.floor(Math.random() * userColorArray.length)];

  return randColor;

}


module.exports = router;
