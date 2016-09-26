
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect("mongodb://localhost:27017/dbname");
var shortid = require('shortid');

// Log error if not connected
mongoose.connection.on('error', console.error.bind(console, 'Connection error.'));

// Log status if we are connected to database
mongoose.connection.once('open', function () {
	// we're connected!
	console.log("Connected to database.");
});

var db = {};

db.Community = mongoose.model('Community', {
	name: String,
	shortName: String,
	shortId: {
		type: String,
		default: shortid.generate
	},
	description: String,
	admins: Array,
	createdAt: Date
});

db.User = mongoose.model('User', {
	userId: Number,
	fname: String,
	lname: String,
	useranme: String,
	email: {
		type: String,
		unique: true,
	},
	password: String,
	phones: Array,
	relationShip: {
		type: String,
		enum: ['single', 'married', 'engaged', 'divorced', 'widow']
	},
	gender: {
		type: String,
		enum: ['male', 'female']
	},
	dob: { type: Date, default: null },
	addresses: Array,
	pictureUrl: String,
	familyTree: {
		type: Object // grandparent, parent, sibling, spouse, children, grandchildren
	},
	utype: { type: Number, default: 1 },
	token: {
		type: String,
		unique: true,
		'default': shortid.generate
	},
	qualifications: Array,
	invited: { type: Date, default: null },
	joined: { type: Date, default: null },
	subscriptions: Object,
	jobSeeker: { type: Boolean, default: true },
	isAdmin: { type: Boolean, default: true },
	communities: Array,
	communityId: Schema.Types.ObjectId,
	isVerified: { type: Boolean, default: false },
	isActive: { type: Boolean, default: false },
	isOnline: { type: Boolean, default: false },
	lastPasswordChanged: { type: Boolean, default: false },
	createdAt: { type: Date },
	serverCreatedAt: { type: Date, default: Date.now }
});

db.SuperAdmin = mongoose.model('Superadmin', {
	fname: String,
	lname: String,
	username: String,
	password: String,
	email: String,
	createdAt: Date
});


db.Jobs = mongoose.model('Jobs', {
	postedBy: String,
	company: String,
	experience: Number,
	addresses: Array,
	postedTime: { type: Date, default: Date.now },
	fresher: { type: Boolean, default: false },
	role: String,
	description: String,
	salary: String,
	industries: Array,
	keySkills: [String]
});

db.Room = mongoose.model('Room', {
	name: String
});

module.exports = db;

