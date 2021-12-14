var TWFEBB = {
    SCRIPT_NAME: 'TW Fix Export Button Bug',
    STYLE_ID: 'TWFEBB-styles',
};

TWFEBB.run = function () {
    var style = '@@twfebbStyles'; // grunt will import real styles

    if (!$('#' + TWFEBB.STYLE_ID).length)
        $('<style id="' + TWFEBB.STYLE_ID + '">')
            .text(style)
            .appendTo(document.head);
};

TWFEBB.stop = function () {
    $('#' + TWFEBB.STYLE_ID).remove();
};
