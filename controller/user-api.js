const express = require('express')

// Requiring our models
let db = require("../models")

let router = express.Router()


// User API Routes
router.get('/', (req, res)=>{


  if(req.session.userId){

    getLoggedInUserData(req.session.userId, function(userData){
      res.json(userData)
    })

  } else {
  //  res.redirect('/users/signin')
  res.json("logged out")
  }
})

router.put('/update/:id', (req, res)=>{

  if (req.session.userId === parseInt(req.params.id) && req.session.userId === parseInt(req.body.id)){

    let updatedUserData = {
      bio: req.body.bio,
      email: req.body.email,
      location: req.body.location,
    }

    updateUserData(req.session.userId, updatedUserData, function(data){

      if (data != 'error'){
        res.json('success')
      } else {
        res.json('error')
      }

    })

  }


})

// Helper Functions
// ========================================================

function getLoggedInUserData(uid, callback){

  db.user.findOne({where:{id:uid}})
    .then(function(data){
      if(data != null){

        db.goal.findAndCountAll(
          {where:{userId:uid}, order: [['updatedAt', 'DESC']]})
          .then(function(goalData){

            let userObj = {
              id: data.id,
              full_name: data.full_name,
              email: data.email,
              location: data.location,
              bio: data.bio,
              color: data.color,
              goal_count: goalData.count,

            }

            callback(userObj)

          })


      } else {

        callback('error')

      }
    })

}

function updateUserData(uid, obj, callback){

  db.user.findOne({where:{id:uid}})
    .then(function(data){

      if (data != null){

        db.user.update(obj,{
          where:{
            id: uid
          }
        }).then(function(data){

          if (data != null){
            callback("success")
          } else {
            callback('error')
          }


        })

      } else {

        callback('error')

      }

    })

}

module.exports = router;
