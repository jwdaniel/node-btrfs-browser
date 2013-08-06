
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , btrfs = require('./routes/btrfs')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));
/*
['/btrfs/component', '/btrfs/package'].forEach(function(docbase) {
    app.use(docbase, express.static(docbase, {maxAge: 5*60*1000}));
    app.use(docbase, express.directory(docbase));
});
*/

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/btrfs', btrfs.list);
app.get('/btrfs/*', btrfs.list);
app.get('/download', btrfs.download);
app.get('/download/*', btrfs.download);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
