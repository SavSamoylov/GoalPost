const express = require('express')


// Requiring our models
let db = require("../models")

let router = express.Router()


// User REGISTER POST Routes
router.post('/add', (req, res)=>{

  if (req.body.goalTitle === ''){
    res.json({error: 'Goal Field is required.'})
  }

  let sub_Id = req.body.goalUserId;

  if (parseInt(sub_Id) === req.session.userId){

    let newGoal = {
      goal: req.body.goalTitle,
      category: req.body.goalCategory,
      goal_description: req.body.goalDescription,
      userId: req.session.userId,
      color: getGoalColor(),
    }

    console.log(newGoal)

    addNewGoal(newGoal, function(feedback){

      if (feedback === "error"){
        res.json("error")
      } else {
        res.json("success")
      }
      console.log(feedback)

    })


  }


})

router.delete('/delete', (req,res)=>{

  let userId = req.body.userId
  let goalId = req.body.goalId

  if(req.session.userId === parseInt(userId)){


    queryGoal(userId, goalId, function(feedback){

      if (feedback){

        db.goal.destroy({
          where:{
            id: goalId
          }
        }).then(function(data){
          res.json("success")
        })

      } else {

        res.json("Something went wrong! Unable to Delete goal at this time.")

      }

    })

  }


})


router.patch('/complete', (req,res)=>{

  let userId = req.body.userId
  let goalId = req.body.goalId

  if(req.session.userId === parseInt(userId)){


    queryGoal(userId, goalId, function(feedback){

      if (feedback){

        db.goal.update({completed:1},{
          where:{
            id: goalId
          }
        }).then(function(data){
          res.json("success")
        })

      } else {

        res.json("Something went wrong! Unable to Complete goal at this time.")

      }

    })

  }


})

router.put('/update', (req,res)=>{


  if(req.session.userId === parseInt(req.body.authorId)){

    let userId = req.session.userId;
    let goalId = req.body.id;

    let updatedGoalObj = {
      goal: req.body.title,
      goal_description: req.body.description,
      category: req.body.cat,
    }

    queryGoal(userId, goalId, function(feedback){

      if (feedback){

        db.goal.update(updatedGoalObj,{
          where:{
            id: goalId,
            userId: req.session.userId,
          }
        }).then(function(data){
          res.json("success")
        })

      } else {

        res.json("Something went wrong! Unable to Update goal at this time.")

      }

    })

  }


})




module.exports = router;


// Helper Functions
// -------------------------------------------------------------

function addNewGoal(goalObj, callback){
  db.goal.create(goalObj)
  .then(function(data){
    callback(data)
  }).catch(function (err) {
    console.log(err)
    callback("error")
  });
}


function queryGoal(uid, gid, callback){

  db.goal.findOne({
    where:{
      userId: uid,
      id: gid
    }
  }).then(function(goal){

    if (goal != null){
      callback(true)
    } else {
      callback(false)
    }

  })

}

function getGoalColor(){

  let goalColorArray = ['teal', 'auburn', 'purple', 'green', 'fuschia']

  let randColor = goalColorArray[Math.floor(Math.random() * goalColorArray.length)];

  return randColor;

}
