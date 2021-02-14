
$('document').ready(function(){
    $('nav').hide();
    //Triggers the custom search bar so the users can search for people they want to add as friends
    $('#addBtn').click(function(){
        alert("Do not click on the search bar or you will F5");
        $('nav').show();
    });

    //Triggers the slide panel to be displayed (It will show the profile page of the friend clicked)
    $('.friend-pic').click(function(){
        var top = $('document').scrollTop;
        $('.slidingPanel').addClass('show');
        $('.slidingPanel').css('margin-top', top);
        $('body').css('overflow', 'hidden');
        
    });

    //Closes the slide panels
    $('.closeBtn').click(function(){
        $('.slidingPanel').removeClass('show');
        $('body').css('overflow', 'auto');
    });
})