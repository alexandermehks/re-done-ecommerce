const routes = require('express').Router();
const dbService = require('../database/db_user')
const { request } = require('http');
const { response } = require('express');


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


module.exports = routes;
