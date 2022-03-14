const routes = require('express').Router();
const dbService = require('../database/db_user')
const nodemailer = require('nodemailer');


let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.user,
        pass: process.env.password
    }
});



routes.post('/email', async(req, res) => {
    try {
        let shoppingcart = req.body.shoppingcart;
        let email = req.body.email;

        console.log("SHOPPINCART", shoppingcart)
        console.log("EMAIL", email)
        let mailOptions = {
            from: process.env.user,
            to: email,
            subject: "Tack för ditt köp",
            text: `Not styled here yet, functionality added. Total sum for order: ${parseInt(req.body.totalInCart * 1.25)} SEK`
        };
        transporter.sendMail(mailOptions, function(err, data) {
            if (err) {
                console.log('Error', err);
            } else {
                console.log("EMAIL SENT")
                res.send("OK")
            }
        })




    } catch (error) {
        res.sendStatus(400, "something went wrong")
    }
})




module.exports = routes;