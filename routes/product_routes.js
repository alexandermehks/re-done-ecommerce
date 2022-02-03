const routes = require('express').Router();
const dbService = require('../database/db_products')
const { request } = require('http');
const { response } = require('express');



routes.get('/all', async(req, res) => {
    try {
        const users = await dbService.getProducts();
        res.send(users);
    } catch (error) {
        res.sendStatus(400, "Something went wrong");
    }
});

routes.get('/allOnlyProduct', async(req, res) => {
    try {
        const users = await dbService.getOnlyProducts();
        res.send(users);
    } catch (error) {
        res.sendStatus(400, "Something went wrong");
    }
});

routes.get('/byProdId/:id', async(req, res) => {
    try {

        if (!req.params.id)
            return res.send("please provide an id");

        const users = await dbService.getProductsByProdID(req.params.id);
        return res.send(users);

    } catch (error) {
        console.log(error)
        return res.sendStatus(400, "Something went wrong");
    }
});







routes.post('/add', async(req, res) => {
    try {
        let mes = await dbService.addProduct(req.body);
        if (mes) {
            res.send("Success")
        }

    } catch (error) {
        res.sendStatus(400, "Something went wrong");
    }
})

routes.post('/addProperty', async(req, res) => {
    try {
        let mes = await dbService.addProductProperty(req.body);
        if (mes) {
            res.send("Success")
        }

    } catch (error) {
        res.sendStatus(400, "Something went wrong");
    }
})



routes.get('/:category', async(req, res) => {
    try {
        const answer = await dbService.getCategory(req.params.category);
        res.send(answer);
    } catch (error) {
        res.sendStatus(400, "Something went wrong");
    }
})


module.exports = routes;