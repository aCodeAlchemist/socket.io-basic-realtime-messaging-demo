var express = require('express');
var router = express.Router();
var db = require("../database/database.js");
var mongoose = require('mongoose');
var multer  = require('multer'); // image uplaod lib
var	crypto = require('crypto'); // native cipher lib
var mime = require('mime');
var fileName = ''; // name of the file which will be generated
var STORAGE_PATH = "./public/images/users/"; // image storage path

/* Multer config  */
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, STORAGE_PATH);
    },
    filename: function(req, file, cb) {
        crypto.randomBytes(11, function(err, raw) {
            var ext;
            var tmp = file.originalname.split('.');
            ext = tmp[tmp.length - 1];
            console.log(ext);
            if (!ext) {
                console.log("no ext.");
                ext = "jpeg";
            }
            // fileName = raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype);
            fileName = raw.toString('hex') + Date.now() + '.' + ext;
            cb(null, fileName);
        });
    }
});
 
var upload = multer({
    storage: storage
});

/** Create new room */
router.post('/createRoom', function(req, res, next) {

	var id = mongoose.Types.ObjectId(); // create Object id
	
	var u = new db.Room({
		_id: id,
		name: req.body.name
	});

	u.save(function(err) {
		res.send({ id: id, name: req.body.name }); // send created id and name of the room in response
	});

});

/** Show all rooms created */
router.get('/rooms', function(req, res, next) {
	db.Room.find({}, function(err, records) {
		res.send(records);
	});
});

/** Add new user */
router.post('/add', function(req, res, next) {
	var id, ip, u;

	id = mongoose.Types.ObjectId();

	// capture client ip
	if (req.headers['x-forwarded-for']) {
		ip = req.headers['x-forwarded-for'];
	} else {
		ip = req.connection.remoteAddress;
	}

	u = new db.User({
		_id: id,
		username: req.body.userName,
		email: req.body.email,
		userAgent: req.headers['user-agent'],
		status: "offline",
		ip: ip
	});

	u.save(function(err) {
		res.send({ id: id, name: req.body.name }); // send user id and name
	});
});

/** UPLOAD MEDIA API */
router.post('/media', upload.single('file'), function (req, res, next) {

	if(fileName){
		var imageStorageBase = "http://" + req.headers.host + "/images/users/";
		res.send({url: imageStorageBase + fileName}); // send file url in response
	} else {
		res.status(500).send("Error when uploading file.");
	}
});

module.exports = router;
