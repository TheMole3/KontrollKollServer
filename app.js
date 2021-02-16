/* Get config file */
configFile = require("./config.json") // Load configFile

/* Start express, socket, mongo and helmet */
fs = require('fs');
var express = require('express');
var app = express();

var server = app.listen(configFile.port || 3006);
const bodyParser = require("body-parser");

var mongojs = require('mongojs');
var db = mongojs(configFile.dbConnect, ['children']); // Import database TheMole and collections bombman and referrals

app.get('/resetDone', (req, res) => {
  db.children.update({$or: [{"tasks.done": true}, {"tasks.done": false}]}, {$set: {"tasks.$[].done": false}, $unset: {"tasks.$[].pic": ""}}, function(err, doc) {
    if(err) res.send(500)
    else res.send(200)
  })
})

app.get('/getTasks', (req, res) => {
  var id = req.query.id;
  db.children.find({id:parseFloat(id)}, (error, data) => {
    res.send(data)
    console.log(data)
  })
})

app.use("/pics", express.static("./pics"))

const multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    console.log(file)
    callback(null, './pics')
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now() + ".jpg")
  }
});

var upload = multer({ storage: storage }).single('photo')

app.post('/finishTask/:id/:pId', function (req, res) {
  upload(req, res, function (err) {
    db.children.update({$and:[{id:parseInt(req.params.pId)}, {"tasks.id":parseInt(req.params.id)}]}, {$set: {"tasks.$.pic": req.file.path, "tasks.$.done": true}}, function(err, doc) {
    })
	db.children.find({$and:[{id:parseInt(req.params.pId)}, {"tasks.id":parseInt(req.params.id)}]}, function(err, docs) {
		console.log(parseInt(docs.tasks[req.params.id].points)
		db.children.update({id:parseInt(req.params.pId)}, {$inc: {points: parseInt(docs.tasks[req.params.id].points)}})
	})
    console.log(req.file.path)
    // Everything went fine.
    res.sendStatus(200)
  })
})
