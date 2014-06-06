var Alloy = require('alloy'), _ = require("alloy/underscore")._, Backbone = require("alloy/backbone");

var locationLookUp = function() {};

locationLookUp.prototype.lookUpAddress = function (query, callback) {
    
    var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + query + "&key=" + Alloy.CFG.forward_geocoding_api_key;
    var repsonse = {};
    var _that = this;
    var client = Ti.Network.createHTTPClient({
         
        onload : function(e) {
            var responseJSON = JSON.parse(this.responseText);
            _that.results = responseJSON.results;
            
            if (callback) {
                callback(_that.results);
            }
        },
         
        onerror : function(e) {
            _that.results = null;
            if (callback) {
                callback(_that.results);
            }
            Ti.API.debug(e.error);
        },
        timeout : 5000  // in milliseconds
    });
    client.open("GET", url); 
    client.send();
    return query;
};
    
locationLookUp.prototype.createResultsTable = function () {
    
    if (!this.results) {
        console.log("No locations set! Use the lookUpAddress method first.");
        return false;
    }    
    var rows = [];
    _.each(this.results, function (item) {
        var row = Ti.UI.createTableViewRow({
            title: item.formatted_address,
            location: item.formatted_address,
            coords: { latitude: item.geometry.location.lat, longitude: item.geometry.location.lng },
            font: { fontSize: "12dp" }
        });
        rows.push(row);
    });
    var tableView = Ti.UI.createTableView({ data: rows, rowHeight: 36 });
    
    var height = rows.length * tableView.getRowHeight();
    if (rows.length >= 4) { height = 4 * tableView.getRowHeight(); }
    tableView.height = height;
    
    return tableView;
};


module.exports = locationLookUp;