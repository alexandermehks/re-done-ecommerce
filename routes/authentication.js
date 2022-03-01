const routes = require('express').Router();
const dbService = require('../database/db_user')
const { request } = require('http');
const { response } = require('express');
const req = require('express/lib/request');


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
routes.post('/doLogIn', async (req, res) => {
     try {
          const match = await dbService.comparePassword(req.body.email, req.body.password);
          if (match) {
               const user = await dbService.getUser(req.body.email);
               console.log(user)
               current_session = req.session;
               current_session.user = {};
               current_session.user.id = user.userID;
               current_session.user.email = user.email;
               current_session.user.name = user.name;
               current_session.user.role = user.role;
               current_session.user.shoppingcart = {};
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

routes.post('/pushToShoppingCart', async (req, res) => {
     try {
          if(current_session.user){
               const cart = current_session.user.shoppingcart;
               const propID = req.body.propID;
               const prodID = req.body.prodID;
               
               if(propID in cart){
                    cart[propID].amount = cart[propID].amount + 1
               }else{
                    cart[propID] = req.body
                    cart[propID]["amount"] = 1
               }
               console.log(cart)

          }
          res.send("OK")
     }
     catch(error){
          res.sendStatus(400, "Something went wrong")
     }
})


routes.get('/loggedInUser', async (req, res) => {
     try {
          let user = {}
          user = req.session;
          if (!current_session.user || !current_session) {
               user['status'] = false;
               res.json(user)
          }
          else if (current_session.user) {
               user = current_session.user;
               user['status'] = true;
               console.log(user)
               res.json(user)
          }
          else {
               user['status'] = false;
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
          if (!current_session) {
               res.send("you are logged out")
          }
          else {
               res.send("you are logged out")
          }

     }
     catch (error) {
          res.send("No logged in user")
     }
})



module.exports = routes;
