const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let IssueSchema = new Schema({
  issue_title: {type: String, required: true},
  issue_text: {type: String, required: true},
  created_by: {type: String, required: true},
  assigned_to: String,
  status_text: String,
  created_on: Date,
  updated_on: Date,
  open: Boolean
});

module.exports = mongoose.model('Issue', IssueSchema);
