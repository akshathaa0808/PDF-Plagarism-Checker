const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    fileName: String,
    text: String,
    plagiarismPercentage: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);