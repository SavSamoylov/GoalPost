const express = require('express')

// Requiring our models
let db = require("../models")

let router = express.Router()

// User SIGNOUT Routes
router.get('/', (req,res)=>{
  req.session.destroy(function(err) {
    if(err) {
      console.log(err);
    } else {
      res.render('login', {success_message: "Succesfully Logged Out"});
    }
  });
})

module.exports = router;
