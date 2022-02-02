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
routes.get('/users', async (req, res) => {
     try {
          const users = await dbService.getUsers();
          res.send(users);
     }
     catch (error) {
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
routes.post('/register', async (req, res) => {
     try {
          const salt = await bcrypt.genSalt();
          const hashedPassword = await bcrypt.hash(req.body.password, salt)
          const addUser = await dbService.addUser(req.body.email, hashedPassword, req.body.name)

     }
     catch (error) {
          res.sendStatus(400, "Something went wrong");
     }
})



routes.post('/pwdcheck', async (req, res) => {
     try {
          const match = await dbService.comparePassword(req.body.email, req.body.password)
          res.send(match)

     }
     catch (error) {
          res.sendStatus(400, "something went wrong")
     }

});

/**
 * LOGIN FRONTEND
 *       logIn() {
               let valid = true;
               let typed_data = {
                    password: document.getElementById("pwd").value,
                    email: document.getElementById("email").value,

               };
               console.log(typed_data)
               if (typed_data.password === "" || typed_data.email === "" || typed_data.password === "" && typed_data.email === "") {
                    console.log("invalid credentials")
                    valid = false;
               }
               location.reload()
               if (valid) {
                    $.ajax({
                         url: '/user/doLogIn',
                         type: 'POST',
                         data: typed_data,
                         success: (result) => {
                              console.log(result)
                         }
                    })
               }
          }
 */
var current_session;
routes.post('/doLogIn', async (req, res) => {
     console.log("Kör nu")
     try {
          const match = await dbService.comparePassword(req.body.email, req.body.password);
          if (match) {
               const user = await dbService.getUser(req.body.email);
               current_session = req.session;
               current_session.user = {};
               current_session.user.email = user.email;
               current_session.user.name = user.name;
               current_session.user.role = user.role;
               res.json(current_session.user)
          }
          else {
               res.send("Cant log you in")
          }
     }
     catch (error) {
          res.sendStatus(400, "Cant log in");
     }
})


routes.get('/loggedInUser', async (req, res) => {
     try {

          let user = {}
          if (current_session.user) {
               console.log(current_session.user)
               user = current_session.user;
               res.json(user)
          }
     }
     catch (error) {
          res.send("No user logged in.")
     }
})


routes.get('/logout', async (req, res) => {
     try {
          current_session = req.session;
          current_session.destroy();
          res.send("you are logged out")

     }
     catch (error) {
          res.send("No logged in user")
     }
})


module.exports = routes;
