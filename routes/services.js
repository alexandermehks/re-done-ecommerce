const routes = require('express').Router();
const dbService = require('../database/db_user')
const nodemailer = require('nodemailer');


let transporter = nodemailer.createTransport({
	service: 'gmail',
	auth:{
		user: process.env.user,
		pass: process.env.password 
	}
});



routes.post('/email', async (req, res) => {
	try{
		let emails = req.body;

		let keys = Object.keys(emails)
		for(let i = 0; i < keys.length; i++){
			let mailOptions = {
				from: process.env.user,
				to: emails[i].email,
				subject: "ECOMMERCE TEST MAIL",
				text: "SAMPLE TEXT"
			};
			transporter.sendMail(mailOptions, function(err, data){
				if(err){
					console.log('Error', err);
				}else{
					console.log("EMAIL SENT")
				}
			})
		}



	}

	catch(error){
		res.sendStatus(400, "something went wrong")
	}
})




module.exports = routes;