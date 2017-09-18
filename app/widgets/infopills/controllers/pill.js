var args = arguments[0] || {};

function init() {
    $.setText(args.text);
}

$.setText = function(text) {
    $.textLabel.setText(text);
}

$.remove = function() {
    console.log('calling remove on view');
    $.view.remove();
}

init();
