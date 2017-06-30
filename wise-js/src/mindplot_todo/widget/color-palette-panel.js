mindplot.widget.ColorPalettePanel = new Class({
    Extends: mindplot.widget.ToolbarPaneItem,

    initialize: function(buttonId, model, baseUrl) {
        this._baseUrl = baseUrl;
        this.parent(buttonId, model);
        $assert($defined(baseUrl), "baseUrl can not be null");
    },

    _load: function() {
        if (!mindplot.widget.ColorPalettePanel._panelContent) {
            // Load all the CSS styles ...
            $('<link>')
                .appendTo($('head'))
                .attr({type: 'text/css', rel: 'stylesheet'})
                .attr('href', this._baseUrl + '/colorPalette.css');

            // Load panel html fragment ...
            var result;
            $.ajax({
                url:this._baseUrl + '/colorPalette.html',
                method:'get',
                async:false,
                success: function(responseText) {
                    result = responseText;
                },
                error: function() {
                    result = '<div>Sorry, your request failed :(</div>';
                }
            });

            mindplot.widget.ColorPalettePanel._panelContent = result;
        }
        return mindplot.widget.ColorPalettePanel._panelContent;
    },

    buildPanel: function() {
        var content = $('<div class="toolbarPanel"></div>').attr('id', this._buttonId + 'colorPalette');
        content.html(this._load());

        // Register on toolbar elements ...
        var colorCells = content.find('div[class=palette-colorswatch]');
        var model = this.getModel();
        var me = this;
        _.each(colorCells, function(elem) {
            $(elem).on('click', function() {
                var color = $(elem).css("background-color");
                model.setValue(color);
                me.hide();
            });
        });

        return content;
    },

    _updateSelectedItem: function() {
        var panelElem = this.getPanelElem();

        // Clear selected cell based on the color  ...
        panelElem.find("td[class='palette-cell palette-cell-selected']").attr('class', 'palette-cell');

        // Mark the cell as selected ...
        var colorCells = panelElem.find('div[class=palette-colorswatch]');
        var model = this.getModel();
        var modelValue = model.getValue();
        _.each(colorCells, function(elem) {
            var color = $(elem).css("background-color").rgbToHex();
            if (modelValue != null && modelValue[0] == 'r') {
                modelValue = modelValue.rgbToHex();
            }

            if (modelValue != null && modelValue.toUpperCase() == color.toUpperCase()) {
                $(elem).parent().attr('class', 'palette-cell palette-cell-selected');
            }
        });
        return panelElem;
    }
});
