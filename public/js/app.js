$(document).ready(function(){

  generalUI();
  getUserUiData();
  updateAccountInfo();




  // Functions
  // ==========================================================================

  function generalUI(){

    $('.profile__User-Avatar').css({
      'background-position': Math.random()*1000 + "px",
    })

    $('.profile__User-Avatar').mouseover(function(){
      $('.profile__User-Edit').css({'display':'block'})
    }).mouseout(function() {
      $('.profile__User-Edit').css({'display':'none'})
    });

    $('.goal__Options').css({'display':'block'})


  }


  //////////////////////////////////////////////////////////////////////////////

  function getUserUiData(){

    $.get('/api/user', function(res){

      // Get Profile User Data Using data-attributes.

      let uName = res.full_name;
      let uId = res.id;
      let uColor = res.color;
      let uEmail = res.email;
      let uLocation = res.location;
      let uBio = res.bio;
      let uGoalCount = res.goal_count;
      let uInitials = function(){
        let splitName = uName.toUpperCase().split(' ');
        let initials = splitName[0].charAt(0) + splitName[1].charAt(0);
        // Directly return the joined string
        return initials.trim();
      }

      // Logged In User Header

      let loggedInHeader = `
      <div class="dropdown show header__nav-UserDropdown">

      <div class="header__nav-UserImage">
      <div class="initials">

      </div>
      </div>

      <a class="dropdown-toggle header__nav-UserName" href="#" role="button" data-toggle="dropdown" data-uid=${[uId]}  aria-haspopup="true" aria-expanded="false">
      </a>
      <div class="dropdown-menu dropdown-menu-right" >
      <a class="dropdown-item" href="/users/${[uId]}"><i class="fa fa-user" aria-hidden="true"></i> Profile</a>
      <a class="dropdown-item" href="/users/edit/${[uId]}"><i class="fa fa-cog" aria-hidden="true"></i> Account</a>
      <a class="dropdown-item" href="/api/signout"><i class="fa fa-sign-out" aria-hidden="true"></i> Log-out</a>
      </div>
      </div>

      <a href="/discover">DISCOVER</a>
      <a href="#/" class="header__btn-action" data-toggle="modal" data-target="#addGoalModal"><i class="fa fa-plus" aria-hidden="true"></i> Add New Goal</a>

      `;


      $('.header__nav').html(loggedInHeader);


      $('.header__nav-UserImage').css({
        'background-color': uColor,
      });

      $('.header__nav-UserImage .initials').text(uInitials);

      $('.header__nav-UserName').text(uName);

      $('#addGoalUserId').val(uId);



      $('.profile__User-AvatarImage').css({
        'background-color': uColor,
      }).text(uInitials);

      $('.profile__User-Name').text(uName);

      $('.profile__User-Location').html('<i class="fa fa-map-marker" aria-hidden="true"></i> '+ uLocation);

      $('.profile__User-Bio').text(uBio);

      if (parseInt(uGoalCount) === 1){
        $('.profile__User-StatsGoalsCount').text(uGoalCount + ' Goal');
      } else {
        $('.profile__User-StatsGoalsCount').text(uGoalCount + ' Goals');
      }

      $('.profile__User-StatsGoalsCount').attr('data-goal-count', uGoalCount)

    })

  }


  //////////////////////////////////////////////////////////////////////////////

  function updateAccountInfo(){

    $('.account__Update-Btn').on("click", function(e){
      e.preventDefault();

      let loggedUserId = $('.header__nav-UserName').attr('data-uid')

      if (loggedUserId === $(this).attr('data-user-id')){

        let updateObj = {
          id: $(this).attr('data-user-id'),
          email: $('#updateEmail').val(),
          location: $('#updateLocation').val(),
          bio: $('#updateBio').val(),
        }


        $.ajax({
          url: '/api/user/update/' + loggedUserId,
          type: 'PUT',
          data: updateObj,
          success: function(result) {
            // Do something with the result
            if (result === 'success'){

              window.location.replace(window.location.pathname)
            }
          }
        });


      }


    })

  }

  //////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////////////////


})
