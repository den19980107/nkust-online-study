let mongoose = require('mongoose');


let RFMSchema = mongoose.Schema({
  videoID: {
      type: String,
      require: true
  },
  avalue: {
      type: String,
      require: true
  },
  bvalue: {
      type: String,
      require: true
  },
  rvalue: {
      type: String,
      require: true
  },
  focusPoint:{
      type: Array
  }
});

let RFM = module.exports = mongoose.model('RFM', RFMSchema, 'RFM');
