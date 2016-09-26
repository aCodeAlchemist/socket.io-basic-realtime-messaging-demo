var express = require('express');
var router = express.Router();
var db = require("../database/database.js");
var mongoose =  require('mongoose');


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/createRoom', function (req, res, next) {

  var id =  mongoose.Types.ObjectId(); 
    console.log("room : ", id);
  var u = new db.Room({
    _id:id,
    name: req.query.name
  });

  u.save(function (err) {
    res.send({id: id});
  });

});


module.exports = router;
