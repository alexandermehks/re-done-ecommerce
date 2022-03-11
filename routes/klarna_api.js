const routes = require('express').Router();
const { response } = require('express');
const { data } = require('node-env-file');
const fetch = (...args) =>
    import ('node-fetch').then(({ default: fetch }) => fetch(...args));
const baseURL = "https://api.playground.klarna.com/";


routes.post('/generateKlarnaOrderId', async(req, res) => {
    try {
        const username = process.env.klarna_username;
        const password = process.env.klarna_password;
        let total = parseInt(req.body.total)
        let final = total * 100
        let shopping_products = {}
        let arr = []
        let keys = Object.keys(req.body.shoppingcart)
        for (let i = 0; i < keys.length; i++) {
            let propID = keys[i]
            let name = req.body.shoppingcart[keys[i]].name
            let amount = req.body.shoppingcart[keys[i]].amount
            let parsedP = parseInt(req.body.shoppingcart[keys[i]].newPrice)
            let parsedAmount = parseInt(amount)

            //Calculations
            let unit_price = Math.round(parsedP * 1.25)
            const tax_rate = 2500
            let total_amount = Math.round(unit_price * amount)
            let tax_amount = total_amount - total_amount * 10000 / (10000 + tax_rate)

            shopping_products["reference"] = propID
            shopping_products['name'] = name
            shopping_products['quantity'] = parsedAmount
            shopping_products['quantity_unit'] = "pcs"
            shopping_products['unit_price'] = unit_price * 100
            shopping_products['tax_rate'] = tax_rate
            shopping_products['total_amount'] = total_amount * 100
            shopping_products['total_discount_amount'] = 0
            shopping_products['total_tax_amount'] = tax_amount * 100
            arr.push(shopping_products)
            shopping_products = {}

        }

        let totalPriceForOrder = 0;
        let totalTaxForOrder = 0;
        for (let i = 0; i < arr.length; i++) {
            totalPriceForOrder += arr[i].total_amount
            totalTaxForOrder += arr[i].total_tax_amount
        }

        let obj = {
            "purchase_country": "SE",
            "purchase_currency": "SEK",
            "locale": "sv-se",
            "order_amount": totalPriceForOrder,
            "order_tax_amount": totalTaxForOrder,
            "order_lines": arr,
            "merchant_urls": {
                "terms": "https://www.example.com/terms.html",
                "checkout": "https://www.example.com/checkout.html",
                "confirmation": "http://localhost:3000/confirmation",
                "push": "https://www.example.com/api/push"
            }
        }
        const headers = {
            'Authorization': 'Basic ' + btoa(`${username}:${password}`),
            'Content-Type': 'application/json'
        }
        const response = await fetch("https://api.playground.klarna.com/checkout/v3/orders", {
                method: 'POST',
                body: JSON.stringify(obj),
                headers: headers
            })
            .then(response => response.json())
            .then(json => {
                console.log(json.order_id)
                res.json(json)

            })
            .catch(error => console.log(error))

    } catch (error) {
        console.log(error)
        res.sendStatus(400, "Something went wrong");
    }
})



routes.post('/getKlarnaOrder', async(req, res) => {
    try {
        const username = process.env.klarna_username;
        const password = process.env.klarna_password;


        const order_id = req.body.order_id;


        const headers = {
            'Authorization': 'Basic ' + btoa(`${username}:${password}`),
        }

        const url = "https://api.playground.klarna.com/checkout/v3/orders/" + order_id

        fetch(url, {
                method: 'GET',
                headers: headers
            })
            .then(ress => ress.json())
            .then(json => res.json(json));

    } catch (error) {
        console.log(error)
        res.sendStatus(400, "Something went wrong");
    }
})


module.exports = routes;