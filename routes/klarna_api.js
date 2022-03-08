const routes = require('express').Router();
const { response } = require('express');
const { data } = require('node-env-file');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const baseURL = "https://api.playground.klarna.com/";


routes.post('/generateKlarnaOrderId', async(req, res) => {
    try {
    	const username = process.env.klarna_username;
    	const password = process.env.klarna_password;
    
    	let shopping_products = {}
    	let arr = []

    	let keys = Object.keys(req.body)
    	for(let i = 0; i < keys.length; i++) {
    		let propID = req.body[keys[i]].propID
    		let name  = req.body[keys[i]].name
    		let amount = req.body[keys[i]].amount
    		let price = req.body[keys[i]].price

    		let taxPrice = price * 0.75

    		let parsedPrice = parseInt(price)

    		let total = parsedPrice + taxPrice
    		var intvalue = Math.floor( total );

    		console.log(intvalue)



    		shopping_products["reference"] = propID
    		shopping_products['name'] = name
    		shopping_products['quantity'] = amount
    		shopping_products['quantity_unit'] = "pcs"
    		shopping_products['unit_price'] = price
    		shopping_products['tax_rate'] = 25
    		shopping_products['total_amount'] = 1099 
    		shopping_products['total_discount_amount'] = 0
    		shopping_products['total_tax_amount'] = 3 
    		arr.push(shopping_products)
    		shopping_products = {}

    	}








    	let obj = {
			    		"purchase_country": "SE",
					    "purchase_currency": "SEK",
					    "locale": "sv-se",
					    "order_amount": 1099,
					    "order_tax_amount": 3,
					    "order_lines":arr, 
					    "merchant_urls": {
					        "terms": "https://www.example.com/terms.html",
					        "checkout": "https://www.example.com/checkout.html",
					        "confirmation": "https://www.example.com/confirmation.html",
					        "push": "https://www.example.com/api/push"
				    }
 					}
 	const headers = {
 		'Authorization': 'Basic '+btoa(`${username}:${password}`),
 		'Content-Type': 'application/json'
 	}
 	const response = await fetch("https://api.playground.klarna.com/checkout/v3/orders", {
			method: 'POST',
			body: JSON.stringify(obj),
			headers: headers 
		})
 		.then(response => response.json())
 		.then(json => console.log(json))
 		.catch(error => console.log(error))
 		res.send("OK")

    } catch (error) {
        console.log(error)
        res.sendStatus(400, "Something went wrong");
    }
})


module.exports = routes;



