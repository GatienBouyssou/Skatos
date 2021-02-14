let $modalDetails = $('#modalDetails');

// make an item favorite or remove it from the favorite
$('body').on("click", "#modalDetails .favorite-btn", (e) => {
    let idSplitted = e.currentTarget.id.split('_');
    let url = '';

    if (e.target.innerHTML === "favorite") { // check if favorite
        let id = '';
        if (idSplitted[1] === "tv") { // check if it is a movie or a tv show
            id += "#listOfFavSeries #" + idSplitted[0] + '_tv';
            url += '/removeToFavouriteTv';
        } else {
            id += "#listOfFavMovies #" + idSplitted[0];
            url += '/removeToFavouriteMovies';
        }

        $.ajax({
            type: 'POST',
            url: url,
            data: {id:idSplitted[0]},
            success: function(result) {
                e.target.innerHTML = "favorite_border";
                $(id).remove();
                initCarousel();
            },
            error: function (err) {
                M.toast({html: err.responseText})
                console.log(err);
            }
        });
    } else {
        let id = '';
        if (idSplitted[1] === "tv") {
            id += "#listOfFavSeries";
            url += '/addToFavouriteTv';
        } else {
            id += "#listOfFavMovies";
            url += '/addToFavouriteMovies';
        }
        $.ajax({
            type: 'POST',
            url: url,
            data: {id:idSplitted[0]},
            success: function(result) {
                e.target.innerHTML = "favorite";
                $(id).prepend(result);
                initCarousel();
            },
            error: function (err) {
                M.toast({html: err.responseText});
                console.log(err);
            }
        });
    }
});

// start watching a series
$('body').on("click", "#modalDetails .started-btn", (e) => {
    let idSplitted = e.currentTarget.id.split('_');
    let url = '';
    url += '/addToStartedTV';
    $.ajax({
        type: 'POST',
        url: url,
        data: {id:idSplitted[0]},
        success: function(result) {
            // add carousel item and refresh carousel
            $('#currentSeries').prepend(result);
            $('#watchLaterSeriesContainer #'+idSplitted[0] +'_tv').remove();
            initCarousel();
            // close se modal smoothly
            $('.modal-container').slideToggle("slow")
            $('.modal-overlay').css("display", "none")
            $('.modal-container').empty()
        },
        error: function (err) {
            M.toast({html: err.responseText})
            console.log(err);
        }
    });

});

// open the modal and fill it
$("body").on("click", ".modal-trigger", (e) => {
    // display modal
    $('.modal-overlay').css("display", "flex");
    $('.modal-container').slideToggle("slow");

    const $modalContainer = $("#modalContainer");
    // display loading circle
    $modalContainer.empty();
    $modalContainer.append(getLoadingCircle());

  $('.modal').modal('open');

    let idSplitted = e.currentTarget.id.split('_');
    let url = '';

    idSplitted[1] === "tv" ? url += '/getDetailsTv' : url += '/getDetailsMovie'; // test if movie or series

    $("#modalContainer").load(url, {id:idSplitted[0]}, () => {
        if (status === "error"){
            $modalContainer.empty();
            $modalContainer.append("" +
                "<i class=\"material-icons circle red\">error</i>\n" +
                "<span class=\"title\">Can't reach the server.</span>\n");
            console.log(err);
        } else {
            // initialise the rating canvas
            const canvas = document.getElementById("canvas");
            buildRateCanvasWithAnimation(canvas, canvas.innerHTML)
        }
    })

});

//  when an element is watched
$('body').on("click", "#modalDetails #tv_checkbox", (e) => {
    const id = e.target.parentNode.id;
    if (e.target.checked) { // series is watched
        $.ajax({
            type: 'POST',
            url: "/changeSeriesToWatched",
            data: {id:e.target.parentNode.id},
            success: function(result) {
                // add element to carousel
                getCarouselItemAndRemoveIt($('#watchLaterSeriesContainer'), id, "tv");
                $('#currentSeries').append(result)
            },
            error: function (err) {
                // get back to previous state and display error
                e.target.checked = false;
                console.log(err);
                M.toast({html: err.responseText})
            }
        });
    } else { // remove from watched
        $.ajax({
            type: 'POST',
            url: "/removeWatchedTv",
            data: {id:e.target.parentNode.id},
            success: function(result) {
                console.log("success")
            },
            error: function (err) {
                e.target.checked = true;
                console.log(err);
                M.toast({html: err.responseText})
            }
        });
    }

});

// when a movie is watched
$('body').on("click", "#modalDetails #movie_checkbox", (e) => {
    const id = e.target.parentNode.id;
    if (e.target.checked) { // if movie is watched
        $.ajax({
            type: 'POST',
            url: "/changeMovieToWatched",
            data: {id:id},
            success: function(result) {
                getCarouselItemAndRemoveIt($('#watchLaterMovieContainer'), id, "movie");
            },
            error: function (err) {
                e.target.checked = false;
                console.log(err);
            }
        });
    } else { // else if you want to remove from watch list
        $.ajax({
            type: 'POST',
            url: "/removeWatchedMovie",
            data: {id:id},
            success: function(result) {
                console.log("success")
            },
            error: function (err) {
                e.target.checked = true;
                console.log(err);
            }
        });
    }

});

// put the background in black
$('body').on("click", '.modal-overlay .close', (event) => {
    $('.modal-container').slideToggle("slow");
    $('.modal-overlay').css("display", "none");
    $('.modal-container').empty()
});

function getCarouselItemAndRemoveIt(carousel, id, type) {
    carousel.find('#'+id+'_'+type).remove();
    initCarousel()
}

function get404Error() {
    return  "<li class=\"collection-item avatar valign-wrapper\">\n" +
        "        <i class=\"material-icons circle red\">error</i>\n" +
        "        <span class=\"title\">Can't reach the server. Please check your internet connection.</span>\n" +
        "    </li>";
}

// display a nice loading circle
function getLoadingCircle() {
    return "<div class=\"preloader-wrapper big active\">\n" +
        "    <div class=\"spinner-layer spinner-blue-only\">\n" +
        "      <div class=\"circle-clipper left\">\n" +
        "        <div class=\"circle\"></div>\n" +
        "      </div><div class=\"gap-patch\">\n" +
        "        <div class=\"circle\"></div>\n" +
        "      </div><div class=\"circle-clipper right\">\n" +
        "        <div class=\"circle\"></div>\n" +
        "      </div>\n" +
        "    </div>\n" +
        "  </div>";
}