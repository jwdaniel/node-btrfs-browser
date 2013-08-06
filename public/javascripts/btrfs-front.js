var initButtons = function() {
    $("button").button().click(function(event) {
        var cmd = event.target.innerText;
        if (cmd == "Download") {
            tr = event.target.parentElement.parentElement.parentElement;
            var aa = document.createElement("a");
            aa.href = document.documentURI + '/' + tr.children[1].innerText;
            var pathname = decodeURIComponent(aa.pathname);
            console.log(pathname);
            window.location.href = '/download?pathname=' + pathname;
        } else if (cmd == 'Create New Repository') {
            console.log(cmd);
            $("#create-dialog").dialog("open");
        } else if (cmd == 'Do Snapshot') {
            console.log(cmd);
        } else if (cmd == 'Delete Snapshot') {
            console.log(cmd);
        }
    });
};

var main = function() {
    initButtons();
};

$(document).ready(main);
