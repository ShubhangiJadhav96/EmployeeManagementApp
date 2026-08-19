// common.js
var SUCCESS = "success";
var ERROR = "error";
var WARNING = "warning";

function showMessageDialog(message, type) {
    var title = "Notice";
    if (type === SUCCESS) title = "Success";
    else if (type === ERROR) title = "Error";
    else if (type === WARNING) title = "Warning";

    bootbox.alert({
        title: title,
        message: message
    });
}