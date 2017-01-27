var args = arguments[0] || {};

function closeWelcome() {
    var index = Alloy.createController("index").getView();
    index.open();
    setTimeout(function () { $.welcome.close(); }, 400);
    Ti.App.Properties.setString("welcomeDone", "true");
};

$.welcome.addEventListener("close", function () {
    setTimeout(function () {
      $.destroy();
    }, 0);
});