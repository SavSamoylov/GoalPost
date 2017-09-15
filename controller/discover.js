const express = require('express')
const moment = require('moment')

// Requiring our models
let db = require("../models")

let router = express.Router()

router.get('/', (req,res)=>{

  if(req.session.userId){

    getDiscoverGoals(req.session.userId, function(goalData){



      res.render("discover", {
        user:{
          userActive:true,
          goal: goalData
      }
    })

    });

  } else {

    getDiscoverGoalsVisitor(function(goalData){


      res.render("discover", {
        user:{
          userActive:false,
          goal: goalData
      }
    })

    });

  }

})


// Helper Functions
// -------------------------------------------------------------

function getDiscoverGoals(uid, callback){

  db.goal.findAll({
    where:{
      userId: {
        $ne:uid
      }
    }, order: [['updatedAt', 'DESC']]
  })
  .then(function(goalData){

    let goalArray = [];

    for (var i = 0; i < goalData.length; i++) {


      let goalObj = {
        id: goalData[i].id,
        title: goalData[i].goal,
        color: goalData[i].color,
        users_id: goalData[i].userId,
        createdAt:  moment(goalData[i].createdAt).startOf('minute').fromNow(),
      }

      goalArray.push(goalObj)
    }


    callback(goalArray)




  })

}


function getDiscoverGoalsVisitor(callback){

  db.goal.findAll({
  order: [['updatedAt', 'DESC']]
  })
  .then(function(goalData){

    let goalArray = [];

    for (var i = 0; i < goalData.length; i++) {


      let goalObj = {
        id: goalData[i].id,
        title: goalData[i].goal,
        color: goalData[i].color,
        users_id: goalData[i].userId,
        createdAt:  moment(goalData[i].createdAt).startOf('minute').fromNow(),
      }

      goalArray.push(goalObj)
    }


    callback(goalArray)


  })

}

function getAuthorData(uid, callback){

  db.user.findOne({where:{id: uid}})
    .then(function(user){
      callback(user)
    })

}



module.exports = router;
