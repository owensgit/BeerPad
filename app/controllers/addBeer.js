var theBeers = Alloy.Collections.beers;

$.addBeerWin.addEventListener("open", function() {
    $.name.focus();
});

$.close.addEventListener("click", function () {
    $.addBeerWin.close();
});

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
        $.addBeerWin.close();
    }
    
});

var camera = {
    onSuccess: function (e, imageViewID) {
        if (e.mediaType === Ti.Media.MEDIA_TYPE_PHOTO) {
            $.beerImage.image = e.media;
        }
    },
    onCancel: function (e) {
        
    },
    onError: function (e) {
        
    }
};

$.imageView.addEventListener("click", function (e) {
    
    var imageViewID = $.beerImage;
    
    Ti.Media.showCamera({
        success: camrea.onSuccess,
        cancel: camrea.onCancel,
        error: camera.onError,
        allowEditing: true,
        mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO],
        videoQuality: Ti.Media.QUALITY_HIGH
    }); 
});






