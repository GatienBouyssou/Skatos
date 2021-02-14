function disapear($slidingPanel) {
    slideOut(0, 100, 0.5, $slidingPanel);
    $('body').css('overflow', 'auto');
}

$("document").ready(function (e) {
    /*make the settings panel appear*/
    let $settingsPanel = $(`#settingsPanel`);
    $("#settingsButton").click(function (e) {
       var top = $('document').scrollTop;
       slideIn(100, 0,0.5, $settingsPanel);
       $settingsPanel.css('margin-top', top);
       $('body').css('overflow', 'hidden');
   });

    $('.closeBtn').click(function(){
        disapear($settingsPanel);
    });

    $(window).on("keydown", function(e) {
        if(e.originalEvent.code === "Escape")
            disapear($settingsPanel);
    });

});