var Alloy = require('alloy'), _ = require("alloy/underscore")._, Backbone = require("alloy/backbone");

var datePicker = (function() {

    var methods = {};

    methods.getPicker = function (opts) {

        opts = opts || {};
        opts.props = opts.props || {};


        // create default maxDate 50 years from now
        function getMaxDate() {
            var d = new Date();
            var year = d.getFullYear();
            var month = d.getMonth();
            var day = d.getDate();
            return new Date(year + 50, month, day);
        }

        if (typeof opts.props.type === 'undefined') {
            opts.props.type = Ti.UI.PICKER_TYPE_DATE;
        }

        Ti.API.info('opts.props', opts.props);
        Ti.API.info('opts.props', JSON.stringify(opts.props));

        var pickerView = Titanium.UI.createView({
            backgroundColor: "#FFF",
            height: 280,
            bottom :-280,
            zIndex: 1000
        }); 
        var cancel = Ti.UI.createButton({
            title:'Cancel',
            style: Ti.UI.iPhone.SystemButtonStyle.BORDERED
        }); 
        var done = Ti.UI.createButton({ 
            title:'Done',   
            style: Ti.UI.iPhone.SystemButtonStyle.DONE
        });     
        var spacer = Ti.UI.createButton({
            systemButton: Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
        });
        var toolbar = Ti.UI.iOS.createToolbar({
            top: 0,
            barColor: Alloy.CFG.colour.main,
            items:[cancel,spacer,done]
        });
        var picker = Ti.UI.createPicker({
            type: opts.props.type,
            value: opts.props.value || new Date(),
            minDate: opts.props.minDate || new Date('1900-01-01'),
            maxDate: opts.props.maxDate || getMaxDate(),
            top: 45
        });

        cancel.addEventListener("click", function (e) {
            try {
                opts.onCancel(e);    
            } 
            catch (e) {
                Ti.API.error('Missing onCanel function in datePicker options');
                Ti.API.error(e);
            }
            
        });

        done.addEventListener("click", function (e) {
            opts.onDone(e, picker);
        });

        pickerView.add(toolbar);
        pickerView.add(picker);
        return pickerView;
    }

    return methods;

})();

module.exports = datePicker;