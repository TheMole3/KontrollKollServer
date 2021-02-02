/* Get config file */
configFile = require("./config.json") // Load configFile

/* Start express, socket, mongo and helmet */
fs = require('fs');
var app = require('express')();

var server = app.listen(configFile.port || 3006);

var mongojs = require('mongojs');
var db = mongojs(configFile.dbConnect, ['children']); // Import database TheMole and collections bombman and referrals


app.get('/getTasks', (req, res) => {
    var id = req.params.id;
    db.children.find({id:parseFloat(id)}, (error, data) => {
        res.send(data)
    })
})


app.use(function(req, res, next){ // 404 response for non defined urls
    res.status(404);
    // respond with html page
    if (req.accepts('html')) {
      res.send(404)
      return;
    }
    // respond with json
    if (req.accepts('json')) {
      res.send({ error: 'Not found' });
      return;
    }
    // default to plain-text. send()
    res.type('txt').send('Not found');
  });