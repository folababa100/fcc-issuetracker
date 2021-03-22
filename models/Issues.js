const mongoose = require("mongoose");

const {
  Schema
} = mongoose;

const issuesSchema = new Schema({
  project_id: {
    type: String,
    required: [true, "required project_id missing"]
  },
  issue_title: {
    type: String,
    required: [true, "required issue_title missing"]
  },
  issue_text: {
    type: String,
    required: [true, "required issue_text missing"]
  },
  created_on: {
    type: Date,
    default: Date.now
  },
  updated_on: {
    type: Date,
    default: Date.now
  },
  created_by: {
    type: String,
    required: [true, "required created_by missing"]
  },
  assigned_to: {
    type: String,
    default: ""
  },
  open: {
    type: Boolean,
    default: true
  },
  status_text: {
    type: String,
    default: ""
  }
}, {
  versionKey: false
})

const Issues = mongoose.model("Issues", issuesSchema);

module.exports = Issues;