var args = arguments[0] || {};

var theBeers = Alloy.Collections.beers;
theBeers.fetch();

if (args.edit) {
    var editBeer = theBeers.where({"alloy_id": args.alloy_id})[0];
    $.title.text = "Edit " + args.title;
    console.log(editBeer.toJSON());

    editBeer.set({name: "Happy juice"});
    editBeer.save();
    
    $.name.value = args.title;
    $.brewery.value = args.brewery || "";
    $.rating.value = args.rating || "";
    $.establishment.value = args.establishment || "";
    $.location.value = args.location || "";
    if (args.notes) $.notes.value = args.notes;
    
} else {
    $.addBeerWin.addEventListener("open", function() {
        $.name.focus();
    });  
}

var theImage; // used to store image blob when camera has taken photo



$.close.addEventListener("click", function () {
    $.addBeerWin.close();
});

var storedImage;

$.addBeerButton.addEventListener("click", function () {
    if (!$.name.value) {
        var dialog = Ti.UI.createAlertDialog({
            message: 'Had one beer too many?\nYou forgot to add a name!',
            ok: 'Okay',
            title: 'Missing Name'
        }).show();
        return;
    } else {
        var beer = Alloy.createModel('beers', {
            name: $.name.value,
            brewery: $.brewery.value,
            rating: $.rating.value,
            establishment: $.establishment.value,
            location: $.location.value,
            notes: $.notes.value
        });
        
        theBeers.add(beer);
        beer.save();       
        
        var alloy_id = beer.get('alloy_id');
        
        var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, alloy_id + '.jpg');
        f.write(theImage);

        $.addBeerWin.close();
    }
    
});

var cameraMethods = {
    onSuccess: function (e, imageViewID) {
        if (e.mediaType === Ti.Media.MEDIA_TYPE_PHOTO) {
            $.beerImage.image = e.media;
            theImage = e.media;
        }
    },
    onCancel: function (e) {
        console.log('Action was cancelled');
    },
    onError: function (e) {
        console.log('An error happened');
    }        
};

$.imageView.addEventListener("click", function (e) {
   
    var imageViewID = $.beerImage;
    
    Titanium.Media.showCamera({
        success: cameraMethods.onSuccess,
        cancel: cameraMethods.onCancel,
        error: cameraMethods.onError,
        allowEditing: true,
        mediaTypes: [Titanium.Media.MEDIA_TYPE_PHOTO],
        videoQuality: Titanium.Media.QUALITY_HIGH
    });
});


$.addBeerWin.addEventListener("close", function() {
    $.destroy();
});