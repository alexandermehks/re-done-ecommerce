const routes = require('express').Router();
const dbService = require('../database/db_user')
const { request } = require('http');
const { response } = require('express');
/**
 logIn() {
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
                         url: '/auth/doLogIn',
                         type: 'POST',
                         data: typed_data,
                         success: (result) => {

                         }
                    })
               }
          },
          
          getLoggedInUser() {
               $.ajax({
                    url: '/auth/loggedInUser',
                    type: 'GET',
                    success: (result) => {
                         console.log(result)

                    }
               })
          },

          logOut() {
               $.ajax({
                    url: '/auth/logout',
                    type: 'GET',
                    success: (result) => {
                         console.log("logged out")
                    }
               })
          }
 */
var current_session;
routes.post('/doLogIn', async (req, res) => {
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
          else {
               console.log("No logged in user")
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
          if (!current_session) {
               res.send("you are logged out")
          }

     }
     catch (error) {
          res.send("No logged in user")
     }
})



module.exports = routes;
