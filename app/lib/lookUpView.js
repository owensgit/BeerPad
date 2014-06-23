var lookUpView = function() {};


lookUpView.viewProps = {
    height: "36dp", width: "260dp", top: "46dp", bottom: "5dp",
    backgroundColor: "#FFFFFF", borderColor: "#b0b0b0", borderRadius: "5dp"    
};
lookUpView.viewPropsClosed = {
    height: "0dp", bottom: "0dp"  
};
lookUpView.viewPropsOpen = {
    bottom: "5dp"  
};
lookUpView.tableRowHeight = 36;

lookUpView.rowProps = {
    font: { fontSize: "12dp" }
};

lookUpView.prototype.init = function () {
    var view = Ti.UI.createView(lookUpView.viewProps); 
    view.applyProperties(lookUpView.viewPropsClosed);
    var tableView = Ti.UI.createTableView({
        rowHeight: lookUpView.tableRowHeight
    });
    view.add(tableView);
    this.view = view;
    this.table = tableView;
};

lookUpView.prototype.closeUp = function () {
    this.view.applyProperties(lookUpView.viewPropsClosed);
};

lookUpView.prototype.update = function (data) {
    var rows = [];
    _.each(data, function (item) {
        var row = Ti.UI.createTableViewRow(item);
        row.applyProperties(lookUpView.rowProps);
        rows.push(row);
    });
    var height = data.length * lookUpView.tableRowHeight;
    if (data.length > 4) { height = (4 * lookUpView.tableRowHeight) - 14; }
    this.table.setData(rows);
    this.view.height = height;
    this.view.applyProperties(lookUpView.viewPropsOpen);
};

module.exports = lookUpView;