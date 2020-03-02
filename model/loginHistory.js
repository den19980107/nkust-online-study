let mongoose = require('mongoose');

//article schema
let loginHistorySchema = mongoose.Schema({
    userId: {
        type: String,
        require: true
    },
    date: {
        type: String,
        require: true,
        default:getLocalDate()
    },
    UTCDate:{
        type:Date,
        require:true,
        default:getUTCDate()
    },
    action: {
        type: String,
        require: true
    },
    inClass:{
        type:String
    },
    detail: {
        type:String,
        require: true
    }
});
function getLocalDate (){
    let localTime = new Date().toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'});
    return localTime
}
function getUTCDate(){
    return new Date();
}
let LoginHistory = module.exports = mongoose.model('LoginHistory', loginHistorySchema, 'loginHistory');