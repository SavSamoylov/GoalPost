$(document).ready(function(){

  let loggedUserId = $('.header__nav-UserName').attr('data-uid')


  listenAddTask(loggedUserId);

  loadTasksProfilePage(loggedUserId);

  loadTasksGoalPage(loggedUserId);





  // Functions
  // ==========================================================================
  //////////////////////////////////////////////////////////////////////////////

  function listenAddTask(uid){


    $('.addNewTaskButton').on('click', function(){
      let goalId = $(this).attr('data-task-button-for-goal')
      let userId = $(this).attr('data-task-button-for-user')

        let newTask = $('.newTask-'+goalId).val().trim()

        if (newTask != ""){

          let taskObj = {
            task: newTask,
            goalId: goalId,
            userId: userId,
          }

          $.post('/api/task/add', taskObj, (res)=>{

            let resTask = res.task;
            let resGoalId = res.goalId;
            let resUid = res.userId;
            let resTaskId = res.taskId;

            let domTask =`
            <li class="profile__Goal-Task profile__Goal-Task-${[resTaskId]} list-group-item"
            data-task-for-goal="${[resGoalId]}"
            data-task-for-user="${[resUid]}"
            data-task="${[resTaskId]}">
            ${[resTask]}
            </li>
            `;

            $(domTask).hide().appendTo('.profile__Goal-Tasks-' + resGoalId).fadeIn('slow')
            $(domTask).hide().appendTo('.goal__Tasks-' + resGoalId).fadeIn('slow')
            $('.newTask-' + resGoalId).val('')
            $('.task__Add-Msg-' + resGoalId).hide().html("<span style='color:green'>New Task Succesfully Added</span>").fadeIn('slow').fadeOut(5000)

            getTaskCount(resGoalId);


          })


        }



    }) // End of Button Action for new Task

  }

  //////////////////////////////////////////////////////////////////////////////

  function loadTasksProfilePage(uid){

    let goalAuthorId = $('.profile__Goal-TaskArea').attr('data-goal-author-id')
    let goalId = $('.profile__Goal-TaskArea').attr('data-task-form-for-goal')

    $.get('/api/task/user/' + goalAuthorId, (res)=>{ // Load all existing tasks.

      
      for (var i = 0; i < res.length; i++) {

        let resTask = res[i].task;
        let resGoalId = res[i].goalId;
        let resUid = res[i].userId;
        let resTaskId = res[i].taskId;

        let domTask =`
        <li class="profile__Goal-Task profile__Goal-Task-${[resTaskId]} list-group-item"
        data-task-for-goal="${[resGoalId]}"
        data-task-for-user="${[resUid]}"
        data-task="${[resTaskId]}">
        ${[resTask]}
        </li>
        `;

        $(domTask).appendTo('.profile__Goal-Tasks-' + resGoalId);

        getTaskCount(resGoalId)

      }
    })

  }

  //////////////////////////////////////////////////////////////////////////////

  function getTaskCount(gid){

    $.get('/api/task/goalcount/'+ gid, (res)=>{

      if (res === parseInt(1)){
        $('.profile__Goal-TaskCount-' + gid).text(res + ' Task in Progress.')
      } else {
        $('.profile__Goal-TaskCount-' + gid).text(res + ' Tasks in Progress.')
      }

    })

  }

  //////////////////////////////////////////////////////////////////////////////


  function loadTasksGoalPage(uid){

    let goalAuthorId = $('.goal__Task-Area').attr('data-goal-author-id')
    let goalId = $('.goal__Task-Area').attr('data-task-form-for-goal')


    $.get('/api/task/goal/' + goalId, (res)=>{ // Load all existing tasks.


      for (var i = 0; i < res.length; i++) {

        let resTask = res[i].task;
        let resGoalId = res[i].goalId;
        let resUid = res[i].userId;
        let resTaskId = res[i].taskId;

        let domTask =`
        <li class="profile__Goal-Task profile__Goal-Task-${[resTaskId]} list-group-item"
        data-task-for-goal="${[resGoalId]}"
        data-task-for-user="${[resUid]}"
        data-task="${[resTaskId]}">
        ${[resTask]}
        </li>
        `;

        $(domTask).appendTo('.goal__Tasks-' + resGoalId);

        getTaskCount(resGoalId)

      }


    })

  }
  //////////////////////////////////////////////////////////////////////////////



  //////////////////////////////////////////////////////////////////////////////




});
