const express = require('express')
const session = require('express-session')
const moment = require('moment')


// Requiring our models
let db = require("../models")

let router = express.Router()


// User REGISTER GET Routes
router.get('/profile/:id', (req, res)=>{

  if(req.session.userId === parseInt(req.params.id)){

    getUserData(req.session.userId, function(userData){
      res.render('member', userData)
      console.log(userData)
    })


  } else {
    res.render('login', {error: "You must be logged in."})
  }
})

router.post('/profile/:id', (req, res)=>{

  if(req.session.userId === parseInt(req.params.id)){

    db.user.findOne(
      {where:{id:req.params.id}})
      .then(function(userData){
        res.json(userData.id)
      })

    }

  })

  // Helper Functions
  // -------------------------------------------------------------

  function getUserData(userId, callback){

    db.user.findOne({where:{id:userId}})
    .then(function(userData){

      db.goal.findAndCountAll(
        {where:{userId:userId}, order: [['updatedAt', 'DESC']]})
        .then(function(goalData){


          let goalArray = []

          for (var i = 0; i < goalData.rows.length; i++) {

            let goalObj = {
              id: goalData.rows[i].id,
              title: goalData.rows[i].goal,
              description: goalData.rows[i].description,
              category: goalData.rows[i].category,
              completion_status: goalData.rows[i].completed,
              created: moment(goalData.rows[i].createdAt).startOf('minute').fromNow(),
              color: goalData.rows[i].color,
              users_name: userData.full_name,
              users_id: userData.id,
              users_color: userData.color,
              users_initials: function(){
                let fName = userData.full_name;
                let splitName = fName.toUpperCase().split(' ');
                let initials = splitName[0].charAt(0) + splitName[1].charAt(0);
                // Directly return the joined string
                return initials.trim();
              },

            }


            goalArray.push(goalObj)

          }


          let userObj = {
            user:{
              id: userData.id,
              full_name: userData.full_name,
              email: userData.email,
              color: userData.color,
              location: userData.location,
              bio: userData.bio,
              initials: function(name){
                let fName = userData.full_name;
                let splitName = fName.toUpperCase().split(' ');
                let initials = splitName[0].charAt(0) + splitName[1].charAt(0);
                // Directly return the joined string
                return initials.trim();
              },
              userActive: true,
            },
            goal: goalArray,
            goal_count: goalData.count,

          }



          // callback(userObj);
          callback(userObj)


        })

      })

    }





    module.exports = router;
