const express = require('express')

// Requiring our models
let db = require("../models")

let router = express.Router()


// User REGISTER GET Routes
router.get('/', (req, res)=>{
  if(req.session.userId){
    res.redirect('/users/profile/'+req.session.userId)
  } else {
    res.redirect('/users/register')
  }
})

router.get('/users/register', (req,res)=>{
  if(req.session.userId){
    res.redirect('/users/profile/'+req.session.userId)
  } else {
    res.render('register')
  }
})


module.exports = router;
