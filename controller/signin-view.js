const express = require('express')

// Requiring our models
let db = require("../models")

let router = express.Router()


// User SIGNIN GET Routes
router.get('/signin', (req, res)=>{
  if(req.session.userId){
    res.redirect('/users/profile/'+req.session.userId)
  } else {
    res.render('login')
  }
})


module.exports = router;
