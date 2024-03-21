const mongoose = require('mongoose');
import userModel from './user.model';

const Settings = new mongoose.Schema({
    user:{
      type: userModel
    },

    organization: {
      type: String, //Should probably reference a collection of organizations/companies
      required: true
    },

    role: {
      type: String,
      required: true,
      
    },
}, {
    collection: 'user-data'
}
);

const model = mongoose.model('SettingsData', Settings)

module.exports = model;