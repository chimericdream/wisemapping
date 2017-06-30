mindplot.widget.ModalDialogNotifier = new Class({
    initialize: function() {},

    //FIXME: replace by alert()
    show: function(message, title) {
        $assert(message, "message can not be null");

        var modalDialog = $('<div class="modal fade">' +
                        '<div class="modal-dialog">' +
                            '<div class="modal-content">' +
                                '<div class="modal-body"></div>' +
                                    '<div class="alert alert-block alert-warning">' +
                                        '<img src="images/alert-sign.png">' +
                                        '<div style="display: inline-block" class="alert-content"></div>' +
                                    '</div>' +
                                '<div class="modal-footer">' +
                                    '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                      '</div>');

        var p = '<p>' + message + '</p>'
        var h4 = title ? '<h4>' + title + '</h4>' : "";

        modalDialog.find('.alert-content').append(h4 + p);
        modalDialog.modal();
    }
});

var dialogNotifier = new mindplot.widget.ModalDialogNotifier();
$notifyModal = dialogNotifier.show.bind(dialogNotifier);
