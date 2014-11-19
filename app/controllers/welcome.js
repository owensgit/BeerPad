var args = arguments[0] || {};

function closeWelcome() {
    var index = Alloy.createController("index").getView();
    index.open();
    setTimeout(function () { $.welcome.close(); }, 500);
    Ti.App.Properties.setString("welcomeDone", "true");
};

$.welcome.addEventListener("close", function () {
    $.destroy();
});


/*$.ScrollableView.addEventListener("scroll", function (e) {
   if (e.currentPage === 4) {
       $.close.animate({
           opacity: 0
       });
   } else {
      $.close.animate({
           opacity: 1
       }); 
   }
});*/