$(document).ready(function(){

  var pathname = window.location.pathname;

  let pathArray = ['/users/signin', '/users/register', '/api/signout']

  if (pathArray.indexOf(pathname) != -1){

    $('.header').css({
      'background': 'none',
      'position': 'absolute',
      'border-bottom': 'none'
    })


    $('.header a').css({'color':'#ffffff'})

    $('.header a').mouseover(function(){
      $(this).css({'color':'#f9f9f9'})
    }).mouseout(function() {
      $(this).css("color","#ffffff");
    });


  }

})
