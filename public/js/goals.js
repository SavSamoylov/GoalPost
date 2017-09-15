$(document).ready(function(){

  let pathname = window.location.pathname;


  addGoal();
  deleteGoal();
  deleteGoalPageGoal();
  completeGoal();
  updateGoal();
  discoverGoal();



  // Functions
  // ==========================================================================
  //////////////////////////////////////////////////////////////////////////////

  function addGoal(){

    $('.add__Goal-Btn').on('click', (e)=>{
      e.preventDefault();

      let goalObj = $( ".add__Goal" ).serialize();


      $.post('/api/goal/add', goalObj, (data)=>{


        if(data.hasOwnProperty("error")){

          let error_msg = `
          <div class="alert alert-danger alert-dismissible fade show add__Goal-Alert" role="alert">
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
          </button>

          <li class="add__Goal-Feedback">${[data.error]}</li>

          </div>
          `

          $('.add__Goal-Msg').append(error_msg)

        } else {

          let success_msg = `
          <div class="alert alert-success alert-dismissible fade show add__Goal-Alert" role="alert">
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
          </button>

          <li class="add__Goal-Feedback">Goal Succesfully Created!</li>

          </div>
          `

          $('.add__Goal-Msg').append(success_msg)

          window.location.replace(window.location.pathname)

        }

      })

    })

  }

  //////////////////////////////////////////////////////////////////////////////

  function deleteGoal(){

    // GOAL CRUD OPERATION - DELETE

    $('.goal__Options-Delete').on('click', function(e){
      e.preventDefault();


      let goalId = $(this).attr('data-delete-goal');
      let authorId = $(this).attr('data-author-id');
      let loggedUserId = $('.header__nav-UserName').attr('data-uid')

      if (authorId === loggedUserId){

        $.ajax({
          url: '/api/goal/delete',
          type: 'DELETE',
          data: { userId: loggedUserId, goalId: goalId},
          success: function(result) {
            // Do something with the result
            if (result === 'success'){
              $('.profile__Goal-' + goalId).fadeOut('slow')

              let goalCount = $(".profile__User-StatsGoalsCount").attr('data-goal-count')

              goalCount = parseInt(goalCount) - 1;

              $(".profile__User-StatsGoalsCount").attr('data-goal-count', goalCount)
              $(".profile__User-StatsGoalsCount").text(goalCount + ' Goals')

            }
          }
        });
      }

    })

  }

  //////////////////////////////////////////////////////////////////////////////

  function completeGoal(){

    // GOAL CRUD OPERATION - COMPLETE/UPDATE

    $('.profile__Goal-CompleteButton').on('click', function(e){
      e.preventDefault();


      let goalId = $(this).attr('data-complete-goal-button');
      let authorId = $(this).attr('data-author-id');
      let loggedUserId = $('.header__nav-UserName').attr('data-uid');

      if (authorId === loggedUserId){

        $.ajax({
          url: '/api/goal/complete',
          type: 'PATCH',
          data: { userId: loggedUserId, goalId: goalId},
          success: function(result) {
            // Do something with the result
            if (result === 'success'){


              $('.profile__Goal-CompleteButton-' + goalId).addClass('completed-goal').prop('disabled',true).text('Completed')
              $('.task__Add-Form-' + goalId).hide();
              window.location.replace(pathname)

            }
          }
        });

      }

    })

  }

  //////////////////////////////////////////////////////////////////////////////

  function deleteGoalPageGoal(){


    $('.goal__Header').mouseover(function(){

      let goalAuthorId = $('.goal__Header').attr('data-goal-author-id');
      let loggedUserId = $('.header__nav-UserName').attr('data-uid')

      if (loggedUserId === goalAuthorId){
        $('.goal__Header-Options').css({'display':'block'})
      } else {
        $('.goal__Header-Options').remove()
      }
    }).mouseout(function() {
      $('.goal__Header-Options').css({'display':'none'})
    });


    // GOAL CRUD OPERATION - DELETE

    $('.goal__Header-OptionsDelete').on('click', function(e){
      e.preventDefault();


      let goalId = $(this).attr('data-delete-goal');
      let authorId = $(this).attr('data-author-id');
      let loggedUserId = $('.header__nav-UserName').attr('data-uid')

      console.log(loggedUserId)
      if (authorId === loggedUserId){


        $.ajax({
          url: '/api/goal/delete',
          type: 'DELETE',
          data: { userId: loggedUserId, goalId: goalId},
          success: function(result) {
            // Do something with the result
            if (result === 'success'){

              window.location.replace('/')
            }
          }
        });
      }

    })

  }

  //////////////////////////////////////////////////////////////////////////////

  function updateGoal(){


    $('.goal__Options-Edit').on('click', function(e){
      e.preventDefault();

      let goalId = $(this).attr('data-goal-id');

      $.get('/goal/info/'+goalId, function(res){
        console.log(res)

        $("#goalTitleUpdate").val(res.title);
        $("#goalCategoryUpdate").val(res.category);
        $("#goalDescriptionUpdate").val(res.description);
        $("#updateGoalInfo").val(res.users_id);
        $('#updateGoalModal').modal();


        $('.update__Goal-Btn').on('click', function(e){
          e.preventDefault();

          let newGoalTitle = $("#goalTitleUpdate").val();
          let newGoalCategory = $("#goalCategoryUpdate").val();
          let newGoalDesc = $("#goalDescriptionUpdate").val();
          let newGoalAuthorId = $("#updateGoalInfo").val();
          let loggedUserId = $('.header__nav-UserName').attr('data-uid');

          if (loggedUserId === newGoalAuthorId){

            let goalObj = {
              title: newGoalTitle,
              description: newGoalDesc,
              cat: newGoalCategory,
              authorId: loggedUserId,
              id: goalId,
            }

            $.ajax({
              url: '/api/goal/update',
              type: 'PUT',
              data: goalObj,
              success: function(result) {
                // Do something with the result
                if (result === 'success'){

                  let success_msg = `
                  <div class="alert alert-success alert-dismissible fade show add__Goal-Alert" role="alert">
                  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                  </button>

                  <li class="add__Goal-Feedback">Goal Succesfully Updated!</li>

                  </div>
                  `

                  $('.update__Goal-Msg').append(success_msg).fadeIn(500)

                  window.location.replace(window.location.pathname)
                }
              }
            });

          }

        })

      })

    })

  }
  //////////////////////////////////////////////////////////////////////////////

function discoverGoal(){

  $( ".discover__Goal" ).each(function() {

    let goalId = $( this ).attr( "data-goal-id" );
    let usersId = $( this ).attr( "data-users-id" );

    $.get('/goal/discover/'+usersId, function(result){

      console.log(result)
      let usersInitials = function(){
        let fName = result.users_name;
        let splitName = fName.toUpperCase().split(' ');
        let initials = splitName[0].charAt(0) + splitName[1].charAt(0);
        // Directly return the joined string
        return initials.trim();
      }

      $('.discover__Goal-AuthorImage-'+usersId).css({'background-color':result.users_color}).text(usersInitials);
      $('.discover__Goal-AuthorName-'+usersId).html(`<a href="/users/${[usersId]}">${[result.users_name]}</a>`)


    })

  });

}



  //////////////////////////////////////////////////////////////////////////////


});
