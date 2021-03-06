const routes = require('express').Router();
const dbService = require('../database/db_user')
const { request } = require('http');
const { response } = require('express');
const res = require('express/lib/response');
const bcrypt = require('bcrypt');
const { nextTick } = require('process');
const session = require('express-session');


/**
 * Route to send the get request to when you want all the users.
 */
routes.get('/users', async(req, res) => {
    try {
        const users = await dbService.getUsers();
        res.send(users);
    } catch (error) {
        res.sendStatus(400, "Something went wrong");
    }
});

/**
 * FRONT END CODE FOR /REGISTER
 *  reg() {
               let valid = true;
               let typed_data = {
                    password: document.getElementById("pwd").value,
                    email: document.getElementById("email").value,
                    name: document.getElementById("name").value
               };
               console.log(typed_data)
               if (typed_data.password === "" || typed_data.email === "" || typed_data.password === "" && typed_data.email === "") {
                    console.log("invalid credentials")
                    valid = false;
               }
               location.reload()
               if (valid) {
                    $.ajax({
                         url: '/user/register',
                         type: 'POST',
                         data: typed_data,
                         success: (result) => {
                              console.log(result)
                         }
                    })
               }
          }
 */
routes.post('/register', async(req, res) => {
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        const addUser = await dbService.addUser(req.body.email, hashedPassword, req.body.username)
        res.send("OK")

    } catch (error) {
        res.sendStatus(400, "Something went wrong");
    }
})



routes.post('/pwdcheck', async(req, res) => {
    try {
        const match = await dbService.comparePassword(req.body.email, req.body.password)
        res.send(match)

    } catch (error) {
        res.sendStatus(400, "something went wrong")
    }

});

routes.post('/postEmail', async(req, res) => {
    let exist = false;
    try {
        const email = await dbService.getEmailFromEmailSub()

        for (let i = 0; i < email.length; i++) {
            if (email[i].email.toString() === req.body.email.toString()) {
                exist = true;
                console.log("email already exist")
                break
            }
        }
        if (!exist) {
            const emailSub = await dbService.addEmailToSub(req.body.email)
        }

    } catch (error) {
        res.sendStatus(400, "something went wrong")
    }

});

routes.get('/getEmails', async(req, res) => {
    try{
        const emails = await dbService.getEmailFromEmailSub()
        res.send(emails)
    }
    catch(error){
       res.sendStatus(400, "Something went wrong") 
    }
})




module.exports = routes;