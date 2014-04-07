var args = arguments[0] || {};

function closeWelcome() {
    var index = Alloy.createController("index").getView();
    index.open();
    setTimeout(function () { $.welcome.close(); }, 300);
    Ti.App.Properties.setString("welcomeDone", "true");
};

$.welcome.addEventListener("close", function () {
    $.destroy();
});



