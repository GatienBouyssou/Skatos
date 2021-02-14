function linkTo(thisBtn, page) {
  $('.btn').attr('class', "btn-flat waves-effect z-depth-3");
  $(thisBtn).attr('class', "btn deep-purple accent-4 waves-effect z-depth-3");
  $('#PageContent').attr('src', "./Pages/"+ page +".html");
  if (document.documentElement.clientWidth < 992) {
    M.Sidenav.getInstance($('.sidenav')).close();
  }
}
