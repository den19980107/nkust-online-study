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
    action: {
        type: String,
        require: true
    },
    page: {
        type:String,
        require: true
    }
});
function getLocalDate (){
    let localTime = new Date().toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'});
    return new Date(localTime)
}
let LoginHistory = module.exports = mongoose.model('LoginHistory', loginHistorySchema, 'loginHistory');