const express = require('express')
const session = require('express-session')
const moment = require('moment')

// Requiring our models
let db = require("../models")

let router = express.Router()


// User REGISTER GET Routes
router.get('/:goalId', (req, res)=>{

  getGoalData(req.params.goalId, function(goalData){

    if (goalData != 'error'){

      getGoalAuthor(goalData.userId, function(userData){


        let goalObj = {
          id: goalData.id,
          title: goalData.goal,
          description: goalData.goal_description,
          category: goalData.category,
          completion_status: goalData.completed,
          created: moment(goalData.createdAt).startOf('minute').fromNow(),
          color: goalData.color,
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


        let userObj = {
          user:{
            id: userData.id,
            // full_name: userData.full_name,
            // email: userData.email,
            // color: userData.color,
            // location: userData.location,
            // bio: userData.bio,
            // initials: function(name){
            //   let fName = userData.full_name;
            //   let splitName = fName.toUpperCase().split(' ');
            //   let initials = splitName[0].charAt(0) + splitName[1].charAt(0);
            //   // Directly return the joined string
            //   return initials.trim();
            // },
            userActive: function(){
              if (req.session.userId){
                return true;
              } else {
                return false;
              }
            },
          },
          goal: goalObj,

        }

         res.render('goal', userObj)


      })



    } else {
      res.json("An error occured. Unable to locate record.")
    }


  })

})


router.get('/info/:goalId', (req, res)=>{

  getGoalData(req.params.goalId, function(goalData){

    if (goalData != 'error'){

      getGoalAuthor(goalData.userId, function(userData){


        let goalObj = {
          id: goalData.id,
          title: goalData.goal,
          description: goalData.goal_description,
          category: goalData.category,
          users_id: userData.id,
        }

         res.json(goalObj)


      })



    } else {
      res.json("An error occured. Unable to locate record.")
    }


  })


})


router.get('/discover/:usersId', (req,res)=>{

  db.user.findOne({where:{
    id:req.params.usersId,
  }}).then(function(userData){

    let userObj = {
      users_name: userData.full_name,
      users_color: userData.color,
    }

    res.json(userObj)


  })

})

// Helper Functions
// -------------------------------------------------------------

function getGoalData(gid, callback){

  db.goal.findOne({where:{id:gid}})
    .then(function(data){

      if (data != null){
        callback(data)
      } else {
        callback('error')
      }

    })

}

function getGoalAuthor(uid, callback){

  db.user.findOne({where:{id:uid}})
    .then(function(data){

      if (data != null){
        callback(data)
      } else {
        callback('error')
      }

    })

}


module.exports = router;
