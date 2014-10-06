var ratingStars = (function () {
    
    var publicMethods = {};
    
    publicMethods.drawStars = function (settings) {
        
        // s for settings - here are some defaults
        var s = {
           rating: 0,
           starSize: 22,
           starColor: Alloy.CFG.colour.main,
           marginRight: 7,
           width: 200,
           imageOff: 'ratingStar',
           imageOn: 'ratingStarON',
           top: 15,
        };
        
        if (settings) {
            for (key in settings) {
                if (s.hasOwnProperty(key)) {
                    s[key] = settings[key];
                }
            }
        }
        
        //totalWidth = ((s.starWidth + s.marginRight) * 5) - s.marginRight;
        totalWidth = Ti.UI.SIZE;
               
        var starView = Ti.UI.createView({ 
            height: s.starHeight, 
            width: totalWidth, 
            layout: "horizontal",
            top: s.top
        });
        
        function createStar(onOff, i) {
            var star = Ti.UI.createLabel({
                font: { fontSize: s.starSize, fontFamily: 'FontAwesome' },  
                text: onOff ? Alloy.Globals.fa.star : Alloy.Globals.fa.starO,
                right: s.marginRight,
                color: s.starColor
            });
            if (i === 4) { star.right = 0; }; 
            //var image = onOff ? s.imageOn : s.imageOff;
            //star.image = image + ".png";
            return star;
        }
        for (var i = 0; i < s.rating; i++) {
            starView.add(createStar(true, i));
        }
        for (var i = s.rating; i < 5; i++) {
            starView.add(createStar(false, i));
        }
        
        return starView;
    };
    
    return publicMethods;
})();


module.exports = ratingStars;