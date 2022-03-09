const routes = require('express').Router();
const { response } = require('express');
const { data } = require('node-env-file');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
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
    	for(let i = 0; i < keys.length; i++) {
    		let propID = keys[i]
    		let name  = req.body.shoppingcart[keys[i]].name
    		let amount = req.body.shoppingcart[keys[i]].amount
    		let parsedP = parseInt(req.body.shoppingcart[keys[i]].price)



    		var intvalue = Math.floor( total );


    		let t_tax_amount = (parseInt((parsedP * amount) * 0.25))

    		let parsedAmount = parseInt(amount)

    		let final_total = parseInt((parsedP + (t_tax_amount/parsedAmount)) * 1000) * parsedAmount
    		shopping_products["reference"] = propID
    		shopping_products['name'] = name
    		shopping_products['quantity'] = parsedAmount 
    		shopping_products['quantity_unit'] = "pcs"
    		shopping_products['unit_price'] = parseInt((parsedP + (t_tax_amount/parsedAmount)) * 1000)
    		shopping_products['tax_rate'] = 2500
    		shopping_products['total_amount'] = parseInt((parsedP + (t_tax_amount/parsedAmount)) * 1000) * parsedAmount 
    		shopping_products['total_discount_amount'] = 0
    		shopping_products['total_tax_amount'] = parseInt(final_total - final_total*10000/(10000+2500))
    		arr.push(shopping_products)
    		shopping_products = {}

    	}

    	console.log(arr)




    	let totalPriceForOrder = 0;
    	let totalTaxForOrder = 0;
    	for(let i = 0; i < arr.length; i++){
    		totalPriceForOrder += arr[i].total_amount
    		totalTaxForOrder += arr[i].total_tax_amount
    	}





    	let obj = {
			    		"purchase_country": "SE",
					    "purchase_currency": "SEK",
					    "locale": "sv-se",
					    "order_amount": totalPriceForOrder,
					    "order_tax_amount": totalTaxForOrder,
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



