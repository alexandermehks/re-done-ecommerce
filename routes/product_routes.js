const routes = require('express').Router();
const dbService = require('../database/db_products')
const { request } = require('http');
const { response } = require('express');
const fs = require('fs');



routes.get('/all', async (req, res) => {
     try {
          const users = await dbService.getProducts();
          res.send(users);
     } catch (error) {
          res.sendStatus(400, "Something went wrong");
     }
});

routes.get('/allOnlyProduct', async (req, res) => {
     try {
          const users = await dbService.getOnlyProducts();
          res.send(users);
     } catch (error) {
          res.sendStatus(400, "Something went wrong");
     }
});

routes.get('/byProdId/:id', async (req, res) => {
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







routes.post('/add', async (req, res) => {
     try {
          let mes = await dbService.addProduct(req.body);
          if (mes) {
               res.send("Success")
          }

     } catch (error) {
          res.sendStatus(400, "Something went wrong");
     }
})

routes.post('/addProperty', async (req, res) => {
     try {
          let mes = await dbService.addProductProperty(req.body);
          if (mes) {
               res.send("Success")
          }

     } catch (error) {
          res.sendStatus(400, "Something went wrong");
     }
})



routes.post('/uploadpicture', async (req, res) => {
     try {
          if (req.files) {
               fs.mkdir(`./uploads/products/${req.body.text}`, (err) => {
                    if (err) {
                         console.log(err)
                    } else {
                         console.log("SUCESS")
                    }
               })
               for (let i = 0; i < req.files.file.length; i++) {
                    var file = req.files.file[i]
                    var filename = file.name
                    const p = `./uploads/products/${req.body.text}/`
                    file.mv(p + filename, function (err) {
                         if (err) {
                              res.send("Upload failed");
                         }
                    });
                    const addtoDatabase = await dbService.addPicture(req.body.text, p + filename)
               }
               res.send("OK")
          } else {
               res.send("ERROR")
          }


     }

     catch (error) {
          res.sendStatus(400, "Something went wrong");
     }
});



routes.get('/pictures', async (req, res) => {
     try {
          const answer = await dbService.getPicture();
          res.send(answer)
     }
     catch (error) {
          res.sendStatus(400, "something went wrong")
     }
})



module.exports = routes;