mindplot.TextEditorFactory = {};

mindplot.TextEditorFactory.getTextEditorFromName = function(name) {
    var editorClass = null;
    if (name == "RichTextEditor") {
        editorClass = mindplot.RichTextEditor;
    } else {
        editorClass = mindplot.TextEditor;
    }
    return editorClass;
};
