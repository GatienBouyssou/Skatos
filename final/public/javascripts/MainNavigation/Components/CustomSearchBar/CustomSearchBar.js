$('body').on("click", ".overlay", ()=>{
  cancelSearch();
});

$('body').on('input', "#search-movie",(e) => {
  searchWithKeyWord(e);
});

function searchWithKeyWord(e) {
  $.ajax({
    type: 'POST',
    url: '/searchMovie',
    data: {query: e.target.value}, // search the current content of the search bar
    success: function(result) {
      $(".collection").empty();
      $(".collection").append(result);
    },
    error: function () {
      $(".collection").empty();
      $(".collection").append(get404Error());
    }
  });
}

$('body').on('input', '#searchFriend', function (e) {
  $.ajax({
    type: 'POST',
    url: '/searchFriend',
    data: {query: e.target.value}, // pass the name of the user chosen
    success: function(result) {
      $(".collection").empty();
      $(".collection").append(result);
    },
    error: function () {
      $(".collection").empty();
      $(".collection").append(get404Error());
    }
  });
});

function openSearch() {
  $('.overlay').show();
  $('body').css("overflow", "hidden");
}

function cancelSearch() {
  M.Collapsible.getInstance($('.collapsible')).close();
  $('.overlay').hide();
  $('body').css("overflow", "auto");
}

// refresh the carousel
function initCarousel() {
  let slider = $('.carousel');

  if (slider.hasClass('initialized')) {
    slider.removeClass('initialized')
  }
  slider.carousel({
    dist: 0,
    padding: 40,
    fullWidth: true,
    noWrap: true,
    numVisible: 8
  });
}

// event on the watch later button
$("body").on("click", ".modal-trigger #watchLater", e => {
  e.stopPropagation();
  let idSplitted = e.currentTarget.parentNode.id.split('_');
  let url = '';

  if (idSplitted[1] === "tv") { // check if element is a movie or tv show
    url += '/insertTv';
  } else {
    url += '/insertMovie';
  }
  $.ajax({
    type: 'POST',
    url: url,
    data: {id : idSplitted[0]}, // pass id of tv show or movie
    success: function(result) {

      if (idSplitted[1] === "tv") { // add element to carousel and refresh it
        $('#watchLaterSeriesContainer').prepend(result);
        initCarousel();
      } else {
        $('#watchLaterMovieContainer').prepend(result);
        initCarousel();
      }
    },
    error: function (result) {
      if (result.responseText) {
        M.toast({html: result.responseText})
      } else {
        M.toast({html: get404Error()})
      }
    }
  });
});

$("body").on("click", ".collection-item", e => {
  e.stopPropagation();
  // clear the panel
  $("#friendSlidingPanel").empty();
  $('.material-tooltip').remove();
  // append the loading circle
  $("#friendSlidingPanel").append("<span>Loading...</span>");
  $("#friendSlidingPanel").show();
  // load the content
  $("#friendSlidingPanel").load("friend", {name:e.currentTarget.id}, () => {
    $('.collection').empty()
    materializeInit();
    loadEventsFriendPage()
  })
});

// add a new friend
$("body").on("click", ".collection-item #addFriend", e => {
    e.stopPropagation();
    $.ajax({
      type: 'POST',
      url: "/addFriend",
      data: {name : e.currentTarget.parentNode.id},
      success: function(result) {
        appendFriendItem(result)
      },
      error: function (result) {
        if (result.responseText) {
          M.toast({html: result.responseText})
        } else {
          M.toast({html: get404Error()})
        }
      }
    });
});