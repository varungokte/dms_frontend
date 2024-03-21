const mongoose = require('mongoose');

import settingsModel from "./settings.model"

const User = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	settings:{
		type: settingsModel
	}
}, {
	collection: 'user-data'
}
);

const model = mongoose.model('UserData', User)

module.exports = model;