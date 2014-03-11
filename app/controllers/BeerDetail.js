var args = arguments[0] || {};

var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, args.alloy_id + '.jpg');

var contents = f.read();

$.BeerDetail.setTitle(args.title);

$.image.image = contents;

$.name.text = args.title;
$.brewery.text = args.brewery;
$.rating.text = args.rating;
$.establishment.text = args.establishment;
$.location.text = args.location;
$.notes.text = args.notes;

if (OS_IOS) {
    var editButton = Ti.UI.createButton({ title: "Edit" });
    $.BeerDetail.setRightNavButton(editButton);
    
    editButton.addEventListener("click", function (e) {
        args.edit = true;
        var window = Alloy.createController('addBeer', args).getView();
        window.open({
            modal:true,
            modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
            modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
        });   
    });
}
