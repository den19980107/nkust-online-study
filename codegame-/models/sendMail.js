var nodemailer = require('nodemailer');
var credentials = require('./credentials');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: credentials.gmail.user,
        pass: credentials.gmail.pass,
    },
});
module.exports.Options = class Options {
    constructor(options) {
        this.from = 'e011798@gmail.com';
        this.to = options.to;
        this.subject = options.subject;
        this.text = options.text;
    }
};
module.exports.sendMail = function (newOptions) {
   var mailOptions = {
        from: newOptions.from,
        to: newOptions.to,
        subject: newOptions.subject,
        text: newOptions.text
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("------mail Test---");
            console.log(error);
        } else {
            console.log("------mail Test---");
            console.log('Email sent: ' + info.response);
        }
    });
}