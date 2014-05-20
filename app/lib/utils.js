var Alloy = require('alloy'), _ = require("alloy/underscore")._, Backbone = require("alloy/backbone");

var utils = (function() {
    var methods = {};
    
    methods.constructTweet = function (args) {
        var string = "Tried this beer called " + args.name + ",";
        if (args.brewery) {
            string = " by " + args.brewery;
        }
        if (args.establishment) {
            string = " at " + args.establishment; 
        }
    };
})();
