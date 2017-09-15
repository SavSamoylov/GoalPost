const express = require('express')
const moment = require('moment')

// Requiring our models
let db = require("../models")

let router = express.Router()


// User Account Edit GET Routes
router.get('/edit/:id', (req, res)=>{

  if(req.session.userId === parseInt(req.params.id)){

    getLoggedInUserData(req.session.userId, req, function(userData){

      if (userData != "error"){
        res.render('account', userData)
      }

    })

  } else {

    res.render('login')

  }
})

router.get('/:userId', (req,res)=>{


  getProfileUserData(req.params.userId, req, function(data){

      res.render('profile', data)

  });


})


// Helper Functions
// ========================================================

function getLoggedInUserData(uid, req, callback){

  db.user.findOne({where:{id:uid}})
  .then(function(data){
    if(data != null){


      let userObj = {
        user: {
          id: data.id,
          full_name: data.full_name,
          email: data.email,
          location: data.location,
          bio: data.bio,
          color: data.color,
          userActive: function(){

            if (req.session.userId){
              return true;
            } else {
              return false;
            }

          },
        }
      }

      callback(userObj)



    } else {

      callback('error')

    }
  })


}



function getProfileUserData(userId, req, callback){

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
            userActive: function(){
              if (req.session.userId){
                return true;
              } else {
                return false;
              }
            },
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
