const routes = require('express').Router();
const dbService = require('../database/db_func_test')
const { request } = require('http');
const { response } = require('express');



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
