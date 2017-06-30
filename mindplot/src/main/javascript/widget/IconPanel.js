mindplot.widget.IconPanel = new Class({
    Extends: mindplot.widget.ToolbarPaneItem,

    initialize: function(buttonId, model) {
        this.parent(buttonId, model);
    },

    _updateSelectedItem: function() {
        return this.getPanelElem();
    },

    buildPanel: function() {
        var content = $('<div class="toolbarPanel" id="IconsPanel"></div>').css({width: 245, height: 230});
        content.on('click', function(event) {
            event.stopPropagation()
        });

        var count = 0;
        for (var i = 0; i < mindplot.ImageIcon.prototype.ICON_FAMILIES.length; i = i + 1) {
            var familyIcons = mindplot.ImageIcon.prototype.ICON_FAMILIES[i].icons;
            for (var j = 0; j < familyIcons.length; j = j + 1) {
                // Separate icons by line ...
                var familyContent;
                if ((count % 12) == 0) {
                    familyContent = $('<div></div>');
                    content.append(familyContent);
                }

                var iconId = familyIcons[j];
                var img = $('<img>')
                    .attr('id', iconId)
                    .attr('src', mindplot.ImageIcon.prototype._getImageUrl(iconId))
                    .attr('class', 'panelIcon');

                familyContent.append(img);

                var panel = this;
                var model = this.getModel();
                img.on('click', function(event) {
                    model.setValue($(this).attr('id'));
                    panel.hide();
                });

                count = count + 1;
            }
        }
        return content;
    }
});
