function slideOut(startingMargin, endMargin, timeout, slideObject) {
    var margLeft = startingMargin;
    var id = setInterval(function () {
        if (margLeft === endMargin) {
            clearInterval(id);
            slideObject.removeClass("show");
        } else {
            margLeft++;
            slideObject.css("margin-left", "-" + margLeft + "%");
        }
    }, timeout);
}

function slideIn(startingMargin, endMargin, timeout, slideObject) {
    slideObject.css("margin-left", "-100%");

    slideObject.addClass('show');
    var margLeft = startingMargin;
    var id = setInterval(function () {
        if (margLeft === endMargin) {
            clearInterval(id)
        } else {
            margLeft--;
            slideObject.css("margin-left", "-" + margLeft + "%");
        }
    }, timeout);
}
