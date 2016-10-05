var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect("mongodb://localhost:27017/dbname");

// Log error if not connected
mongoose.connection.on('error', console.error.bind(console, 'Connection error.'));

// Log status if we are connected to database
mongoose.connection.once('open', function () {
	// we're connected!
	console.log("Connected to database.");
});

var db = {};

/*  Room users model*/
db.User = mongoose.model('RoomUsers', {
	useranme: String,
	email: String,
	status: {
		type: String,
        enum: ['online', 'offline', 'idle']
	},
	createdAt: { type: Date, default: Date.now },
	userAgent: String,
	ip: String
});

/** Room model */
db.Room = mongoose.model('Room', {
	name: String
});

module.exports = db;

