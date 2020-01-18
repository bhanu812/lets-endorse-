const mongoose = require('mongoose');
const _ = require('lodash');

const hrUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50
  },
  password: {
    type: String,
    required: true
  }
});

const hrUser = mongoose.model('hrUser', hrUserSchema);

exports.hrUser = hrUser;
exports.hrUserSchema = hrUserSchema;

