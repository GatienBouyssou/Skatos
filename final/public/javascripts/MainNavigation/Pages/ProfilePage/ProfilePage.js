$('document').ready(function(){
    // open the profile of a new friend
    $('body').on("click", ".friend-pic", function(e){
        // clear friend panel
        $("#friendSlidingPanel").empty();
        $('.material-tooltip').remove();
        // ad loading circle
        $("#friendSlidingPanel").append("<span>Loading...</span>");
        $("#friendSlidingPanel").show();
        // load content
        $("#friendSlidingPanel").load("friend", {name:e.target.parentNode.id}, () => {
            materializeInit();
            loadEventsFriendPage()
        })

    });
    $('body').on("click", "#closeFriend", function(){
        $("#friendSlidingPanel").hide()
    });
    // show the search bar when click on the button to add friends
    $('body').on("click", "#addBtn", function(){
        $('nav').css('opacity', '1');
        $('nav .overlay').show();
        document.getElementById("searchFriend").focus();
    });
    // search disappear when loose the focus
    $('body').on("focusout","#searchFriend", function(){
        $('nav').css('opacity', '0');
        $('nav .overlay').hide();
    });
});
