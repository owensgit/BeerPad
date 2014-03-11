var Alloy = require('alloy'), _ = require("alloy/underscore")._, Backbone = require("alloy/backbone");

var theCamera = {
    
    takePhoto: function () { 
        
        var theImage;
         
        Titanium.Media.showCamera({
            success: function (e, imageViewID) {
                if (e.mediaType === Ti.Media.MEDIA_TYPE_PHOTO) {
                    theImage = e.media;
                }
            },
            cancel: function (e) {
                console.log('Action was cancelled');
            },
            error: function (e) {
                console.log('An error happened');
            },
            allowEditing: true,
            mediaTypes: [Titanium.Media.MEDIA_TYPE_PHOTO],
            videoQuality: Titanium.Media.QUALITY_HIGH
        });
        
        alert('Photo taken!');
        return theImage;
    }
};

module.exports = theCamera;