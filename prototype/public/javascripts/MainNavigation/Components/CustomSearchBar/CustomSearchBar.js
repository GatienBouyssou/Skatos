$('.overlay').click(()=>{
  cancelSearch();
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
