var Grid = function(parent, colums, rows) {
    var cellSize = "10px";
    this._parent = parent;
    this._container = this._createContainer();
    var tbody = $(this._container.firstChild.firstChild);

    for (var i = 0; i < rows; i++) {
        var trElement = $('<tr></tr>');
        for (var j = 0; j < colums; j++) {
            var tdElement = $('<td></td>');
            tdElement.css({
                    width: cellSize,
                    height: cellSize,
                    borderWidth: "1px",
                    borderStyle: "dashed",
                    borderColor: "lightsteelblue"}
            );
            trElement.append(tdElement);
        }
        tbody.append(trElement);
    }
};

Grid.prototype.setPosition = function(x, y) {
    this._container.style.left = x;
    this._container.style.top = y;
};

Grid.prototype.render = function() {
    $(this._parent).append(this._container);
};

Grid.prototype._createContainer = function() {
    var result = window.document.createElement("div");
    result.style.tableLayout = "fixed";
    result.style.borderCollapse = "collapse";
    result.style.emptyCells = "show";
    result.style.position = "absolute";
    result.innerHTML = '<table style="table-layout:fixed;border-collapse:collapse;empty-cells:show;"><tbody id="tableBody"></tbody></table>';
    return  result;
};
