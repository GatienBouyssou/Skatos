$('document').ready(function(){
    let $slidingPanel = $('.slidingPanel');

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

    $('#addBtn').click(function(){
        $('nav').css('opacity', '1');
        $('nav .overlay').show();
    });
});
