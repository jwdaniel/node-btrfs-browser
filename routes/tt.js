var AP = require('./articleprovider-memory.js').ArticleProvider;

var provider1 = new AP();
var provider2 = new AP();

provider1.save([
  {title: 'Post four', body: 'Body four'}
], function(err, articles) {
    provider1.findAll(function(err, docs) {
        console.log(docs);
    });
    provider2.findAll(function(err, docs) {
        console.log(docs);
    });
});


