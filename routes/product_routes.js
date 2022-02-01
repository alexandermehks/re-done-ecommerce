const routes = require('express').Router();
const dbService = require('../database/db_products')
const { request } = require('http');
const { response } = require('express');



routes.get('/all', async (req, res) => {
     try {
          const users = await dbService.getProducts();
          res.send(users);
     }
     catch (error) {
          res.sendStatus(400, "Something went wrong");
     }
});


routes.post('/add', async (req, res) => {
     try {
          let mes = await dbService.addProduct(req.body);
          res.send("bajs");

     }
     catch (error) {
          res.sendStatus(400, "Something went wrong");
     }
})


module.exports = routes;

