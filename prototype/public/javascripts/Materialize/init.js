$(document).ready(function(){
  $('.sidenav').sidenav();

  $('.carousel').carousel({
    dist: 0,
    padding: 40,
    fullWidth: true,
    noWrap: true,
  });

  $('.dropdown-trigger').dropdown({
    constrainWidth: false,
  });

  $('.collapsible').collapsible();

  $('.modal').modal({
    startingTop: '0',
    endingTop: '0'
  });

  $('.tabs').tabs({
    onShow: () => {
      if (M.Tabs.getInstance($('.tabs')).index == 1) {
        $('.social-container').hide("slow");
      }else {
        $('.social-container').show("slow");
      }
    }
  });
});
