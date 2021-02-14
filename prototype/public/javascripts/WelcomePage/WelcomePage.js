$('.connection-btn').click(()=>{
  $('.connection-btn').hide();
  $('.close-btn').show();
  $('.connection-card').css('display', 'flex');
});

$('.close-btn').click(()=>{
  $('.connection-btn').show();
  $('.close-btn').hide();
  $('.connection-card').css('display', 'none');
});
