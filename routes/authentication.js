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
routes.post('/doLogIn', async(req, res) => {
    try {
        let login_Google = false
        if (req.body.type === "GOOGLE") {
            current_session = req.session;
            current_session.user = {};
            current_session.user.email = req.body.email;
            current_session.user.name = req.body.name;
            current_session.user.type = "GOOGLE";
            current_session.user.shoppingcart = {};
            current_session.user.totalInCart = 0;
            current_session.user.klarna_html = "";
            login_Google = true
            res.json(current_session.user)
        }
        if(!login_Google){
        const match = await dbService.comparePassword(req.body.email, req.body.password);
        if (match) {
            const user = await dbService.getUser(req.body.email);
            current_session = req.session;
            current_session.user = {};
            current_session.user.id = user.userID;
            current_session.user.email = user.email;
            current_session.user.name = user.name;
            current_session.user.role = user.role;
            current_session.user.shoppingcart = {};
            current_session.user.totalInCart = 0;
            current_session.user.klarna_html = "";
            res.json(current_session.user)
        } else {
            res.send("Cant log you in")
        }
    }} catch (error) {
        res.sendStatus(400, "Cant log in");
    }
})

routes.post('/pushToShoppingCart', async(req, res) => {
    try {
        if (current_session.user) {
            console.log(current_session.user)
            const cart = current_session.user.shoppingcart;
            const propID = req.body.propID;
            const prodID = req.body.prodID;

            if (propID in cart) {
                cart[propID].amount = cart[propID].amount + 1
                let parseval = parseInt(req.body.newPrice)
                current_session.user.totalInCart += parseval;
            } else {
                cart[propID] = req.body
                cart[propID]["amount"] = 1
                let parseval = parseInt(req.body.newPrice)
                current_session.user.totalInCart += parseval;
            }

        }
        res.send("OK")
    } catch (error) {
        res.sendStatus(400, "Something went wrong")
    }
})

routes.post('/removeFromShoppingCart', async(req, res) => {
    try {
        const cart = current_session.user.shoppingcart;
        let keys = Object.keys(cart)
        for (let i = 0; i < keys.length; i++) {
            if (keys[i].toString() === req.body.prodID.toString()) {
                current_session.user.totalInCart -= cart[req.body.prodID].price * cart[req.body.prodID].amount
                delete cart[req.body.prodID]
                res.send("OK")
            }
        }



    } catch (error) {
        res.sendStatus(400, "something went wrong")
    }
})

routes.post('/updateAmount', async(req, res) => {
    try {
        const propID = req.body.propID;
        const value = req.body.value;
        let cart = current_session.user.shoppingcart;
        let totalInCart = current_session.user.totalInCart;
        let keys = Object.keys(cart)

        for (let i = 0; i < keys.length; i++) {
            if (keys[i].toString() === propID.toString()) {
                //FOR DECREMENT OF AMOUNT
                if (cart[propID].amount != 0 && value === "-1") {
                    cart[propID].amount += -1;
                    current_session.user.totalInCart -= parseInt(cart[propID].price)
                } else if (value === "1" && cart[propID].amount != 10) {
                    cart[propID].amount += 1;
                    current_session.user.totalInCart += parseInt(cart[propID].price)
                }

            }
        }

        res.send("OK")

    } catch (error) {
        res.sendStatus(400, "Something went wrong")
    }
})


routes.get('/loggedInUser', async(req, res) => {
    try {
        let user = {}
        user = req.session;

        if (!current_session.user || !current_session) {
            user['status'] = false;
            res.json(user)
        } else if (current_session.user) {
            user = current_session.user;
            user['status'] = true;
            res.json(user)
        } else {
            user['status'] = false;
            res.json(user)
        }
    } catch (error) {
        res.send("No user logged in.")
    }
})

routes.get('/clearCart', async(req, res) => {
    try {
        let user = {}
        user = req.session;

        if (!current_session.user || !current_session) {
            res.send("Could not empty cart")
        } else if (current_session.user) {
            current_session.user.shoppingcart = {};
            current_session.user.totalInCart = 0
            res.send("Cart cleared")
        } else {
            user['status'] = false;
            res.send(user)
        }
    } catch (error) {
        res.send("No user logged in.")
    }
})


routes.get('/logout', async(req, res) => {
    try {
        current_session = req.session;
        current_session.destroy();
        if (!current_session) {
            res.send("you are logged out")
        } else {
            res.send("you are logged out")
        }

    } catch (error) {
        res.send("No logged in user")
    }
})

routes.post('/updateEmail', async(req, res) => {
    try {
        if (current_session.user) {
            console.log(current_session.user)
            if (req.body.email) {
                console.log("before", current_session.user)
                current_session.user.email = req.body.email;
                console.log("after", current_session.user)
            } else {
                console.log("no email exists in body")
            }

        }
        res.send("Email updated")
    } catch (error) {
        res.sendStatus(400, "Something went wrong")
    }
})


routes.post('/updateKlarnaHtml', async(req, res) => {
    try {
        if (current_session.user) {
            current_session.user.klarna_html = req.body
            console.log(current_session.user.klarna_html)
            res.send("OK")
        }
    } catch (error) {
        res.sendStatus(400, "Something went wrong")
    }
})

routes.post('/updateKlarnaObj', async(req, res) => {
    try {
        if (current_session.user) {

            if (req.body.klarna_obj) {
                current_session.user.klarna_obj = req.body.klarna_obj
                res.send("OK")
            } else {
                res.sendStatus(400, "Something went wrong")
            }
        }
    } catch (error) {
        res.sendStatus(400, "Something went wrong")
    }
})









module.exports = routes;