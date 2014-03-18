var args = arguments[0] || {};
var beersCollection = Alloy.createCollection('beers');
beersCollection.fetch();


// The Image

function getImage() {
    var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, args.alloy_id + '.jpg');  
    return f.read();  
}
if (getImage()) $.image.image = getImage();



// The Details

$.BeerDetail.setTitle(args.title);
Alloy.Globals.mapLabelText($, args);



// Navigation Bar Button

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



// Update Beer after edit event fired in addBeer.js

Ti.App.addEventListener("app:updateBeer", function(e) {
    beersCollection.fetch();
    var test = beersCollection.where({"alloy_id": args.alloy_id})[0].toJSON();
    
    $.BeerDetail.setTitle(test.title);
    
    $.image.image = getImage();
    
    Alloy.Globals.mapLabelText($, test);
    
    args = test;
});



// Apply Star Ratings

var starArray = [$.star1, $.star2, $.star3, $.star4, $.star5];

function applyRating(number) {
    rating = number;
    for (var i = 0; i < number; i++) {
        starArray[i].setImage('ratingStarON.png');
    }
    for (var i = number; i < 5; i++) {
        starArray[i].setImage('ratingStar.png');
    }
}

applyRating(args.rating);
