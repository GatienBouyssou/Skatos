function materializeInit(){
  $('.sidenav').sidenav();

  $('.carousel').carousel({
    dist: 0,
    padding: 40,
    fullWidth: true,
    noWrap: true,
    numVisible: 8
  });

  $('.collapsible').collapsible();

  $('.tabs').tabs();

  $('.tooltipped').tooltip();
}

$(document).ready(function() {
  materializeInit()
})
