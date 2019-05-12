let mongoose = require('mongoose');


let RFMSchema = mongoose.Schema({
  videoID: {
      type: String,
      require: true
  },
  Rvalue: {
      type: String,
      require: true
  },
  Fvalue: {
      type: String,
      require: true
  },
  Mvalue: {
      type: String,
      require: true
  },
  focusPoint:{
      type: Array
  }
});

let RFM = module.exports = mongoose.model('RFM', RFMSchema, 'RFM');
