function carouselNext(button) {
  var instance = M.Carousel.getInstance(button.parentElement.parentElement);
  instance.next();
}
function carouselBack(button) {
  var instance = M.Carousel.getInstance(button.parentElement.parentElement);
  instance.prev();
}


// when click on the been remove the item
$('body').on('click', ".removable .remove-item", function (e) {
    e.stopPropagation();
    const id = e.currentTarget.parentNode.parentNode.parentNode.parentNode.parentNode.id;
    let url = '';
    $('#'+id).remove();
    initCarousel();
    const idSplitted = id.split('_');
    if (id.split('_')[1] === "tv") { // change url if it's a tv show or a movie
        url += '/removeTv';
    } else {
        url += '/removeMovie';
    }
    $.ajax({
        type: 'POST',
        url: url,
        data: {id : idSplitted[0]},
        error: function (result) {
            if (result.responseText) {
                M.toast({html: result.responseText})
            } else {
                M.toast({html: get404Error()})
            }
        }
    });
});

// special event for the current series but supposed to remove the item as well
$('body').on('click', "#currentSeries .remove-current-item", function (e) {
    e.stopPropagation();

    const id = e.currentTarget.parentNode.firstChild.id.split('_')[0];
    $(e.target).parents('.carousel-item').remove()
    initCarousel();
    $.ajax({
        type: 'POST',
        url: '/removeCurrentSeries',
        data: {id : id},
        error: function (result) {
            if (result.responseText) {
                M.toast({html: result.responseText})
            } else {
                M.toast({html: get404Error()})
            }
        }
    });
});

// Go to next episode
$('body').on('click', "#currentSeries .nextEpisode", function (e) {
    e.stopPropagation();
    const id = e.currentTarget.previousSibling.id.split('_')[0];
    e.target.innerHTML = "more_horiz"; // display ...
    $.ajax({
        type: 'POST',
        url: '/nextEpisode',
        data: {id : id},
        success: function(result) {
            e.target.innerHTML = "fast_forward";
            $(e.currentTarget.parentNode.parentNode).replaceWith(result)
            initCarousel()
        },
        error: function (result) {
            e.target.innerHTML = "fast_forward";
            if (result.responseText) {
                M.toast({html: result.responseText})
            } else {
                M.toast({html: get404Error()})
            }
        }
    });

});
