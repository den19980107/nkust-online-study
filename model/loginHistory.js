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
        type: Date,
        require: true,
        default:getUTCDate()
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
    let date = localTime.split(", ")[0];
    let time = localTime.split(", ")[1];
    let year = date.split("/")[2];
    let month = date.split("/")[0];
    let day = date.split("/")[1];
    return `${year}/${month}/${day} ${time}`
}

function getUTCDate(){
    var d = new Date();
    const offset = 8
    // convert to msec
    // add local time zone offset
    // get UTC time in msec
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);

    // create new Date object for different city
    // using supplied offset
    var nd = new Date(utc + (3600000*offset));
    console.log(nd)
    return nd;
}
let LoginHistory = module.exports = mongoose.model('LoginHistory', loginHistorySchema, 'loginHistory');