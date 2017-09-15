const express = require('express')


// Requiring our models
let db = require("../models")

let router = express.Router()

router.get("/user/:id", (req,res)=>{

  let userId = req.params.id;

    // TASKS

    db.task.findAll({where:{userId:userId}, order: [['id', 'ASC']]})
    .then(function(taskData){

      let taskArray = []

      for (var i = 0; i < taskData.length; i++) {

        let taskObj = {
          id: taskData[i].id,
          task: taskData[i].description,
          userId: taskData[i].userId,
          goalId: taskData[i].goalId,
          completion_status: taskData[i].completed,
        }

        taskArray.push(taskObj)

      }

      res.json(taskArray)

    })


})




router.get('/goalcount/:goalId', (req,res)=>{

  db.task.findAndCountAll({where:{goalId:req.params.goalId}})
  .then(function(task){


    if (parseInt(task.count) > 0){
      res.json(task.count);
    } else {
      res.json("0")
    }


  })

})


router.get('/goal/:goalId', (req,res)=>{

  db.task.findAndCountAll({where:{goalId:req.params.goalId}, order: [['id', 'ASC']]})
  .then(function(taskData){

    console.log(taskData)
    console.log("TASK COUNT " , taskData.count)

    let taskArray = []

    for (var i = 0; i < taskData.rows.length; i++) {

      let taskObj = {
        id: taskData.rows[i].id,
        task: taskData.rows[i].description,
        userId: taskData.rows[i].userId,
        goalId: taskData.rows[i].goalId,
        completion_status: taskData.rows[i].completed,
        count: taskData.count,
      }

      taskArray.push(taskObj)

    }

    res.json(taskArray)


  })



})




router.post("/add", (req, res)=>{

  let goalId = req.body.goalId;
  let userId = req.body.userId;
  let task = req.body.task;

  if (req.session.userId === parseInt(userId)){

    // Check if Goal is associated to User.
    checkGoal(userId, goalId, function(data){

      if (data === 'no record found'){

        res.json("No record Found")

      } else if (data === 'error'){

        res.json('error')

      } else {

        // Add Task to Database
        let newTaskObj = {
          description: task,
          goalId: goalId,
          userId: userId,
        }

        addTask(newTaskObj, function(data){

          console.log(data)

          if (data != 'error'){

            let returnTask = {
              task: data.description,
              goalId: data.goalId,
              userId: data.userId,
              taskId: data.id,
            }

            res.json(returnTask)

          } else {

            res.json('error')

          }

        })

      }

    })

  }

})

// Helper Functions
// -------------------------------------------------------------

function checkGoal(uid, gid, cb){

  db.goal.findOne({
    where:{
      id: gid,
      userId: uid,
    }
  }).then((goal)=>{
    if (goal != null){
      cb(goal)
    } else {
      cb("No record found")
    }
  }).catch(function (err) {
    console.log(err)
    cb("error")
  });

}

function addTask(obj, cb){

  db.task.create(obj)
  .then(function(data){
    cb(data)
  }).catch(function(err) {
    console.log(err)
    cb("error")
  });

}


module.exports = router;
