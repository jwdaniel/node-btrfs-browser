var fs = require('fs');
var url = require('url');
var path = require('path');
var async = require('async');
var spawn = require('child_process').spawn;

var eval_btrfs = function(pathname, prefix, callback) {
    var p = path.normalize(pathname);
    var prop = {repo: null, version: null, insubvol: false};
    while (p != prefix) {
        if (! prop.insubvol) {
            if (fs.existsSync(path.join(p, '00VERSION.txt'))) {
                prop.repo = p;
            } else if (fs.existsSync(path.join(p, '..', '00VERSION.txt'))) {
                prop.repo = path.dirname(p);
                prop.insubvol = true;
                prop.version = path.basename(p);
            }
        }
        p = path.dirname(p);
    }
    callback(prop);
};

var getdatetime = function(timestring) {
    var twodigit = function(num) {
        return (num >= 10 ? num : '0' + num);
    };
    var ts = new Date(timestring);
    var yyyy = ts.getFullYear();
    var mm = twodigit(ts.getMonth()+1);
    var dd = twodigit(ts.getDate());
    var HH = twodigit(ts.getHours());
    var MM = twodigit(ts.getMinutes());
    var SS = twodigit(ts.getSeconds());
    return (yyyy + '-' + mm + '-' + dd + ' ' + HH + ':' + MM + ':' + SS);
};

var getfilelist = function(path, callback) {
    fs.readdir(path, function(err, list) {
        /*
        async.map(list, fs.stat, function(err, results) {
            console.log(err);
            console.log(results);
        });
        */
        var files = [];
        var calls = [];
        if (err) {
            callback(files);
            return;
        }
        list.forEach(function(file) {
            if (file.substr(0,1) == '.')
                return;
            calls.push(function(cb) {
                fs.stat(path + '/' + file, function(err, stat) {
                    if (stat) {
                        if (stat.isDirectory()) {
                            files.push({filename: file, filetype: '[DIR]', filesize: '', lastmod: getdatetime(stat.mtime), stat: stat});
                        } else {
                            files.push({filename: file, filetype: '', filesize: stat.size, lastmod: getdatetime(stat.mtime), stat: stat});
                        }
                    }
                    cb(err);
                });
            });
        });
        async.parallel(calls, function(err, result) {
            files.sort(function(a, b) {
                if (a.filetype == b.filetype) {
                    return a.filename.localeCompare(b.filename);
                } else {
                    return b.filetype.localeCompare(a.filetype);
                }
            });
            callback(files);
        });
    });
};

/*
getfilelist('/btrfs/component', function(data) {
    console.log(data);
});
*/

exports.list = function(req, res){
    fs.realpath(decodeURIComponent(req.url), function(err, pathname) {
        fs.stat(pathname, function(err, stat) {
            if (stat && stat.isFile()) {
                res.download(pathname);
            } else {
                eval_btrfs(pathname, '/btrfs', function(prop) {
                    getfilelist(pathname, function(files) {
                        if (pathname == '/btrfs') {
                            var parentpath = '/btrfs';
                        } else {
                            var parentpath = path.dirname(pathname);
                        }
                        res.render('btrfs', { title: 'ICE Release Management System', path: pathname, parentpath: parentpath, files: files, btrfs: prop });
                    });
                });
            }
        });
    });
};

exports.download = function(req, res){
    var urlobj = url.parse(req.url, true);
    fs.realpath(decodeURIComponent(urlobj.query.pathname), function(err, pathname) {
        fs.stat(pathname, function(err, stat) {
            if (stat && stat.isFile()) {
                res.download(pathname);
            } else {
                var parentdir = path.dirname(pathname);
                var listdir = path.basename(pathname);
                var archivefile = __dirname + '/public/download/' + listdir + '.zip';
                var proc = spawn("/usr/bin/7z", ["a", "-r", "-tzip", archivefile, listdir], {cwd: parentdir});
                proc.stdout.on('data', function(data) {
                    console.log('stdout: ' + data);
                });
                proc.stderr.on('data', function(data) {
                    console.log('stderr: ' + data);
                });
                proc.on('close', function(code) {
                    res.download(archivefile);
                });
                // files.each(function(file) {
                //     spawn( /usr/bin/7z a -r -tzip $archivefile $file >/dev/null 2>&1 );
                // }
            }
        });
    });
};
