var nodemailer = require('nodemailer');

class MailServer {

    constructor() {
        this.service = "gmail";
        this.username = "nkust.online.study@gmail.com";
        this.password = `u3t"jnh4C\\p&Q'gZ]I7Z,I[E)9Qk`;
    }

    sendMail(from, to, subject, message, res) {
        var transporter = nodemailer.createTransport({
            service: this.service,
            auth: {
                user: this.username,
                pass: this.password
            }
        });
        var mailOptions = {
            from: from || this.username,
            to: to,
            subject: subject,
            html: message
        };
        console.log(mailOptions);

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                if (res) {
                    res.sendStatus(500)
                }
            } else {
                console.log('Email sent: ' + info.response);
                if (res) {
                    res.sendStatus(200)
                }
            }
        });
    }
}

let mailServerInstant = module.exports = new MailServer();