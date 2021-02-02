/* Get config file */
configFile = require("./config.json") // Load configFile

/* Start express, socket, mongo and helmet */
fs = require('fs');
var app = require('express')();

var server = app.listen(configFile.port || 3006);

var mongojs = require('mongojs');
var db = mongojs(configFile.dbConnect, ['children']); // Import database TheMole and collections bombman and referrals

db.children.find({}, (error, data) => {
    console.log(data)
})

app.get('/getTasks', (req, res) => {
    var id = req.query.id;
    db.children.find({id:parseFloat(id)}, (error, data) => {
        res.send(data)
    })
})

const multer = require("multer");

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

const upload = multer({
  dest: "/tempPics"
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
});


app.post(
  "/finishTask",
  upload.single("file" /* name attribute of <file> element in your form */),
  (req, res) => {
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, "./uploads/image.png");

    if (path.extname(req.file.originalname).toLowerCase() === ".png") {
      fs.rename(tempPath, targetPath, err => {
        if (err) return handleError(err, res);

        res
          .status(200)
          .contentType("text/plain")
          .end("File uploaded!");
      });
    } else {
      fs.unlink(tempPath, err => {
        if (err) return handleError(err, res);

        res
          .status(403)
          .contentType("text/plain")
          .end("Only .png files are allowed!");
      });
    }
  }
)

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