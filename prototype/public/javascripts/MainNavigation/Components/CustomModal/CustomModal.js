if (document.documentElement.clientWidth < 769) {
  $('.modal').attr('class', 'modal bottom-sheet z-depth-0');
}else {
  $('.modal').attr('class', 'modal z-depth-0');
}
window.onresize = () => {
  if (document.documentElement.clientWidth < 769) {
  	$('.modal').attr('class', 'modal bottom-sheet z-depth-0');
  }else {
    $('.modal').attr('class', 'modal z-depth-0');
  }
}
$('.favorite-btn').click(()=>{
  if ($('.favorite-btn').children("i").html() == "favorite") {
    $('.favorite-btn').children("i").html("favorite_border");
  }else {
    $('.favorite-btn').children("i").html("favorite");
  }
});
