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
        const user = await dbService.getUsers();
        res.send(user);
    } catch (error) {
        res.sendStatus(400, "Something went wrong");
    }
});






routes.put('/editUser', async(req, res) => {

    try {
        console.log(req.body)

        const salt = await bcrypt.genSalt();

        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        let user = await dbService.updateUser(req.body, hashedPassword);

        if (user) {
            res.send("Success")
        }

    } catch (error) {
        res.sendStatus(400, "Something went wrong");
    }

})

routes.post('/deleteUser', async(req, res) => {
    try {

        let del = await dbService.deleteUsers(req.body);


        if (del) {
            res.send("SUCCESS")
        }
    } catch (error) {
        console.log(error)
        res.sendStatus(400, "Something went wrong");
    }

})
module.exports = routes;