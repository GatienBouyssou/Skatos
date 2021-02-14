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

$('document').ready(function(){
    let $slidingPanel = $('.slidingPanel');
    $('#addBtn').click(function(){
        alert("Add Friend");
    });


    $('.friend-pic').click(function(){
        var top = $('document').scrollTop;
        slideIn(100, 0, 0.5, $slidingPanel);
        $slidingPanel.css('margin-top', top);
        $('body').css('overflow', 'hidden');
        
    });

    $('.closeBtn').click(function(){
        slideOut(0,100, 0.5, $slidingPanel);
        $('body').css('overflow', 'auto');
    });
});