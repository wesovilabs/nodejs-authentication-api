/**
 * Created by Ivan on 4/5/15.
 */

var express = require('express');

var app = express();


var port = process.env.PORT || 7654;

require('./config/express')(app);
require('./config/routes')(app);

app.listen(port);
console.log('Express app started on port ' + port);
module.exports = app;