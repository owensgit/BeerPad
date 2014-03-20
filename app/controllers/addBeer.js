var args = arguments[0] || {};
var theBeers = Alloy.Collections.beers;
theBeers.fetch();



// Array of Star Images for use in applyRating() below

var starArray = [$.star1, $.star2, $.star3, $.star4, $.star5];



// Edit Mode

if (args.edit) {
    var editBeer = theBeers.where({"alloy_id": args.alloy_id})[0];
    $.title.text = "Edit this beer";
    
    $.name.value = args.name;
    $.brewery.value = args.brewery || "";
    $.percent.value = args.percent || "";
    $.establishment.value = args.establishment || "";
    $.location.value = args.location || "";
    if (args.notes) $.notes.value = args.notes;

    $.addBeerButton.title = "Save beer"; 
    
    applyRating(args.rating);  
}



// Stored values for use

var theImage;
var rating;



// Func to map args to modal

function mapArgs() {
    return {
        name: $.name.value,
        brewery: $.brewery.value,
        rating: rating, // set by applyRating() func below
        percent: $.percent.value,
        establishment: $.establishment.value,
        location: $.location.value,
        notes: $.notes.value
    };
};


function percentIsNumber(percent) {
    var regEx = /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/;
    if (percent.match(regEx)) {
        return true;   
    }
}
function percentIsValid(percent) {
    percent = parseInt(percent, 10);
    if (percent <= 100) {
        return true;
    }
}

// Add Beer Function

$.addBeerButton.addEventListener("click", function () {
    if (!$.name.value) {
        var dialog = Ti.UI.createAlertDialog({
            message: 'You forgot to add a name!\n',
            ok: 'Whoops!',
            title: 'Had one beer too many?'
        }).show();
        return;
    }
    if (!percentIsNumber($.percent.value)) {
        var dialog = Ti.UI.createAlertDialog({
            message: 'You can use decimals too\n',
            ok: 'Change percentage',
            title: 'Percent not a number!'
        }).show();
        return;    
    }
    if (!percentIsValid($.percent.value)) {
        var dialog = Ti.UI.createAlertDialog({
            message: 'You can\'t have a beer with a percentage higher than 100!\n',
            ok: 'Change percentage',
            title: 'More than 100%!'
        }).show();
        return;    
    }
    
    if (args.edit) {
        editBeer.set(mapArgs());
        editBeer.save();
        Ti.App.fireEvent("app:updateBeer");
        var alloy_id = editBeer.get('alloy_id');        
        var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, alloy_id + '.jpg');
        f.write(theImage);
        $.addBeerWin.close();
    } else {
        var beer = Alloy.createModel('beers', mapArgs());
        
        theBeers.add(beer);
        beer.save();       
        
        if (theImage) {
            var alloy_id = beer.get('alloy_id');
            var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, alloy_id + '.jpg');
            f.write(theImage);   
        }
        
        $.addBeerWin.close();
    }    
});



// Add Image

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



// Rating

function applyRating(number) {
    rating = number;
    for (var i = 0; i < number; i++) {
        starArray[i].setImage('ratingStarON.png');
    }
    for (var i = number; i < 5; i++) {
        starArray[i].setImage('ratingStar.png');
    }
}

for (var i = 0; i < 5; i++) {
   starArray[i].addEventListener("click", function () {
       applyRating(starArray.indexOf(this) + 1);
   }); 
};



// Misc

$.addBeerWin.addEventListener("close", function() {
    $.destroy();
});


$.close.addEventListener("click", function () {
    $.addBeerWin.close();
});