function appendFriendItem(result) {
    $('#addBtn').after(result);
    initCarousel();
    $('.tooltipped').tooltip();
}

function loadEventsFriendPage(){
    let $removeBtn = $('#removeBtn');
    // add or remove a friend
    $('.delBtn').click(function(e){
        let url = '/';

        if ($removeBtn.text() === 'remove') { // check if we need to remove or add it
            $removeBtn.text('add');
            url += "removeFriend";
        } else {
            $removeBtn.text('remove');
            url += "addFriend";
        }
        const name = $('#friendName').text();
        $.ajax({
            type: 'POST',
            url: url,
            data: {name : name},
            success: function(result) {
                if (url === '/addFriend') { // add element to friend carousel
                    appendFriendItem(result);
                } else { // remove element from carousel
                    let friendCarouselItem = $('#profileFriends #' + name);
                    friendCarouselItem[0].remove();
                    initCarousel();
                    $('.tooltipped').tooltip();
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
}