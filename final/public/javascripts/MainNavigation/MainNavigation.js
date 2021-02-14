// main navigation when logged
$('.menu > li > a').click( function(event) {
  // set button style
  $('.btn').attr('class', "btn-flat waves-effect z-depth-3");
  $(this).attr('class', "btn deep-purple accent-4 waves-effect z-depth-3");
  // get page
  let page = event.target.getAttribute("page");
  $("#PageContent").attr('class', page+"-content");
  // Activity not done yet so skip it
  if (page === "/Activity") {
    M.toast({html:"<li class=\"collection-item avatar valign-wrapper\">\n" +
          "        <i class=\"material-icons circle red\">error</i>\n" +
          "        <span class=\"title\">Sorry this part is not implemented yet. But it's comming soon ;)</span>\n" +
          "    </li>"})
    return;
  }
    window.history.pushState(null, "Skatos TV",  page); // change the url
  // show loading circle
  $("#PageContent").empty();
  $("#PageContent").append(getLoadingCircle());
  $.ajax({
    type: 'POST',
    url: page,
    data: {id:page},
    success: function(result) {
      // clean page content
      $("#PageContent").empty();
      $("#PageContent").append(result);
      materializeInit();
    },
    error: function (err) {
      if (err.responseText) {
        M.toast({html: err.responseText})
      } else {
        M.toast({html: get404Error()})
      }
    }
  });
});

$('#settings').click( () => {
  let $settingsContent = $("#settingsContent");
  $("#settingsPanel").show();
  // display loading circle
  $settingsContent.empty();
  $settingsContent.append(getLoadingCircle());
  $.ajax({
    type: 'POST',
    url: "/Settings",
    data: {id:'settings'},
    success: function(result) {
      // display settings
      $settingsContent.empty();
      $settingsContent.append(result);
      materializeInit();
      loadEventsSettings();
    },
    error: function (err) {
      if (err.responseText) {
        M.toast({html: err.responseText})
      } else {
        M.toast({html: get404Error()})
      }
    }
  });
});


$('#exit').click(() => {
  window.location = '/Deconnection';
});

// when refresh page update the menu to the good page thanks to the url
$('.btn').attr('class', "btn-flat waves-effect z-depth-3");
let links = $('.menu a');

for(var i = 0; i < links.length; i++) {
  if (window.location.pathname === links[i].attributes.page.value) {
    links[i].classList = "btn deep-purple accent-4 waves-effect z-depth-3";
  }
}