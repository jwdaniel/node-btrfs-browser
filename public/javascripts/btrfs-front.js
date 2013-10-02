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
            $("#create-dialog").dialog("open");
        } else if (cmd == 'Do Snapshot') {
            if ($("#btrfsrepo").text() == "") {
                alert('Not a repository!');
            } else {
                $('#snapversion').val('');
                $("#snapshot-dialog").dialog("open");
            }
        }
    });
};

var initDialogs = function() {
    $.fx.speeds._default = 300;
    $("#create-dialog").dialog({
        title: 'Create a repository',
        autoOpen: false,
        show: "blind",
        modal: true,
        width: 600,
        height: 200,
        buttons: {
            "Create": function() {
                // var args = {'command': 'createrepo', 'repotype': $('#repotype option:selected').val(), 'reponame': $('#reponame').val()};
                var args = {'command': 'createrepo', 'username': $('#username').val(), 'path': $('#btrfspath').text(), 'reponame': $('#reponame').val()};
                console.log(args);
                $.get('/command', args, function(data) {
                    console.log('new repository created!');
                    $("#create-dialog").dialog("close");
                });
            },
            "Close": function() {
                $(this).dialog( "close" );
            }
        }
    });
    // var repo = "sandbox";
    $("#snapshot-dialog").dialog({
        title: 'Snapshot repository: ' + $("#btrfsrepo").text(),
        autoOpen: false,
        show: "blind",
        modal: true,
        width: 600,
        height: 200,
        buttons: {
            "Create": function() {
                var args = {'command': 'snapshot', 'repo': $('#btrfsrepo').text(), 'snapversion': $('#snapversion').val()};
                console.log(args);
                $.get('/command', args, function(data) {
                    console.log('a new snapshot created');
                    $('#snapshot-dialog').dialog('close');
                });
            },
            "Close": function() {
                $(this).dialog('close');
            }
        }
    });
};

var initInfo = function() {
    // $('#changes').val('');
    var args = {'command': 'readfile', 'pathname': $('#btrfspath').text(), 'filename': 'Changes.txt'};
    console.log(args);
    $.get('/command', args, function(data) {
        $("#changes").html('<pre>' + data + '</pre><hr>');
    });
};

var main = function() {
    initButtons();
    initDialogs();
    initInfo();
};

$(document).ready(main);
