var Alloy = require('alloy'), _ = require("alloy/underscore")._, Backbone = require("alloy/backbone");

var datePicker = function() {

    var methods = {};

    this.picker;

    this.getPicker = function (opts) {

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
        this.picker = Ti.UI.createPicker({
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

        var self = this;
        done.addEventListener("click", function (e) {
            result = self.picker.getValue();
            opts.onDone(e, self.picker);
        });

        pickerView.add(toolbar);
        pickerView.add(this.picker);
        this.pickerView = pickerView;
        return this.pickerView;
    }

    /*
     * Adds a column to the picker with numbers within a given range. An increment can
     * be added, if the range is not divisible by the increment then the final increment
     * be the different between the increment and final number.
     * @param fromNum {Number} starting number
     * @param toNum {Number} ending number
     * @param increment {Number} how much to increment by, default is 1
     * @param selected {Number} 
     */
    this.addNumberColumnWithRange = function (fromNum, toNum, increment) {
        var column = Ti.UI.createPickerColumn()
        function formatNum(n){
            return n > 9 ? "" + n: "0" + n;
        }
        for (var i = fromNum; i<=toNum; i++) {
            var row = Ti.UI.createPickerRow({
                title: formatNum(i)
            });
            column.addRow(row);
        }
        this.picker.add(column);
    }

    this.animateIn = function () {
        this.pickerView.animate({bottom: 0, duration: 500});
    }

    this.animateOut = function (callback) {
        this.pickerView.animate(
            {bottom: -280, duration: 500},
            function () {
                if (typeof callback === 'function') {
                    callback();
                }
                this.pickerView = null;
            }
        );
    }

};

module.exports = datePicker;