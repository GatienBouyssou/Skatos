// set sign in panel visible
$('.connection-btn').click(()=>{
  $('.connection-btn').hide();
  $('.close-btn').show();
  $('.connection-card').css('display', 'flex');
});

// set sign up panel visible
$('.close-btn').click(()=>{
  $('.connection-btn').show();
  $('.close-btn').hide();
  $('.connection-card').css('display', 'none');
});

$('body').on("click", ".tab", () => {
  if ($('#tabSignUp').hasClass("active")) {
    // Log In
    $('.social-container').slideUp('slow')
    $('#login_card').slideUp('slow')
    $('#signup_card').slideDown('slow')
  }else {
    // Sign Up
    $('.social-container').slideDown('slow')
    $('#login_card').slideDown('slow')
    $('#signup_card').slideUp('slow')
  }
})

$(document).ready(function () {
  // when the user has done error bring back to sign up
  if ($('#tabSignUp').hasClass("active")) {
    $('.social-container').hide();
    $('#signup_card').show();
    $('#login_card').hide();
  }
});