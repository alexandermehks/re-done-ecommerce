const routes = require('express').Router();
const dbService = require('../database/db_products')
const { request } = require('http');
const { response } = require('express');
const fs = require('fs');
const { data } = require('node-env-file');



routes.get('/all', async(req, res) => {
    try {
        const users = await dbService.getProducts();
        res.send(users);
    } catch (error) {
        res.sendStatus(400, "Something went wrong");
    }
});

routes.get('/allCategories', async(req, res) => {
    try {
        const users = await dbService.getAllCategories();
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


routes.post('/paginationObjectOnlyProducts', async(req, res) => {
    try {
        let pagination = false;
        let num_rows = 10
        if (req.body.num_rows) {
            num_rows = req.body.num_rows;
        }
        //getPaginationObjectOnlyProducts


        const users = await dbService.getPaginationObjectOnlyProducts(num_rows);
        res.send(users);
    } catch (error) {
        res.sendStatus(400, "Something went wrong");
    }
});

routes.post('/allOnlyProductPagination', async(req, res) => {
    try {
        let pagination = false;
        let num_rows = 10
        let page_num = 1;
        if (req.body.num_rows && req.body.page_num) {
            pagination = true;
            num_rows = req.body.num_rows;
            page_num = req.body.page_num
        }


        const users = await dbService.getOnlyProducts(pagination, num_rows, page_num);
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


routes.get('/allColors', async(req, res) => {
    try {
        const users = await dbService.getColors();
        res.send(users);
    } catch (error) {
        res.sendStatus(400, "Something went wrong");
    }
});

routes.get('/getAllProductsWithPropertiesByIdAndColor', async(req, res) => {
    try {
        const users = await dbService.getAllProductsWithPropertiesByIdAndColor();
        res.send(users);
    } catch (error) {
        res.sendStatus(400, "Something went wrong");
    }
});



routes.post('/getProductPropertiesByProdAndColorID', async(req, res) => {
    try {
        console.log(req.body)
        const users = await dbService.getProductPropertiesByProdAndColorID(req.body.prodID, req.body.colorID, req.body.type);
        res.send(users);
    } catch (error) {
        res.sendStatus(400, "Something went wrong");
    }
});

routes.post('/addOrder', async(req, res) => {
    try {
        console.log(req.body.loggedin)
        let mes = await dbService.addOrders(req.body.loggedin);
        if (mes) {

            console.log(mes)
            res.send(mes)
        }

    } catch (error) {
        console.log(error)
        res.sendStatus(400, "Something went wrong");
    }
})

routes.post('/getOrdersById', async(req, res) => {
    try {
        console.log(req.body)
        const orderID = req.body.orderID;
        const orders = await dbService.getOrdersByOrderID(orderID);
        res.send(orders);
    } catch (error) {
        res.sendStatus(400, "Something went wrong");
    }
});
routes.get('/getAllOrders', async(req, res) => {
    try {
        const users = await dbService.getOrders();
        res.send(users);
    } catch (error) {
        res.sendStatus(400, "Something went wrong");
    }
});


routes.post('/getOrdersByUserID', async(req, res) => {
    try {
        console.log(req.body)
        const orders = await dbService.getOrdersByUserID(req.body.email);
        res.send(orders);
    } catch (error) {
        res.sendStatus(400, "Something went wrong");
    }
});

routes.put('/editOrderStatus', async(req, res) => {
    /* 
        Example send data
        {
            "orderID": 9,
            "status": "recieved"
        }

    */
    try {
        let status = req.body.status;
        let orderID = req.body.orderID;

        const mes = await dbService.editOrderStatus(orderID, status);

        if (mes) {
            res.send("Success")
        }

    } catch (error) {
        res.sendStatus(400, "Something went wrong");
    }
})

routes.delete('/deleteOrder', async(req, res) => {
    try {
        let orderID = req.body.orderID;


        const mes = await dbService.deleteOrder(orderID);

        if (mes) {
            res.send("Order was removed")
        }

    } catch (error) {
        console.log(error)
        res.sendStatus(400, "Something went wrong");
    }
})





routes.put('/edit', async(req, res) => {
    try {


        let mes = await dbService.editProduct(req.body);

        if (mes) {
            res.send("Success")
        }

    } catch (error) {
        res.sendStatus(400, "Something went wrong");
    }
})





routes.post('/add', async(req, res) => {
    try {
        let mes = await dbService.addProduct(req.body);
        if (mes) {
            const id = mes
            console.log(mes)
            res.send(id)
        }

    } catch (error) {
        res.sendStatus(400, "Something went wrong");
    }
})

routes.put('/edit', async(req, res) => {
    try {
        console.log(req.body, "WE OUT BAD")
        let mes = await dbService.editProduct(req.body);

        if (mes) {
            res.send("Success")
        }

    } catch (error) {
        res.sendStatus(400, "Something went wrong");
    }
})

//Delete product
routes.delete('/deleteProduct', async(req, res) => {
    try {
        console.log(req.body, "WE OUT BAD")
        let mes = await dbService.removeProduct(req.body);

        if (mes) {
            res.send("Success")
        }

    } catch (error) {
        console.log(error)
        res.sendStatus(400, "Something went wrong");
    }
})



routes.post('/addProperty', async(req, res) => {
    try {
        //console.log("bajs2", req)
        let mes = await dbService.addProductProperty(req);
        if (mes) {
            res.send("Success")
        }

    } catch (error) {
        console.log(error)
        res.sendStatus(400, "Something went wrong");
    }
})

//Delete property
routes.delete('/deleteProperty', async(req, res) => {
    try {
        let mes = await dbService.removeProperty(req.body);

        if (mes) {
            res.send("Success")
        }

    } catch (error) {
        console.log(error)
        res.sendStatus(400, "Something went wrong");
    }
})





routes.post('/uploadpicture', async(req, res) => {

    const folder_path = './public/index/images/uploads/products/' + req.body.id;
    const folder_path_ = 'images/uploads/products/' + req.body.id;

    try {
        if (req.files) {

            try {
                if (!fs.existsSync(folder_path)) {
                    fs.mkdirSync(folder_path, { recursive: true });
                }
            } catch (err) {
                console.error(err);
            }

            if (!req.files.file.length) {
                var file = req.files.file
                var filename = file.name
                const p = folder_path
                file.mv(p + "/" + filename, function(err) {
                    if (err) {
                        res.send("Upload failed");
                    }
                });
                const query = folder_path_ + "/" + filename;

                const addtoDatabase = await dbService.addPicture(req.body.id, query)
            } else {

                for (let i = 0; i < req.files.file.length; i++) {
                    var file = req.files.file[i]
                    var filename = file.name
                    const p = folder_path
                    file.mv(p + "/" + filename, function(err) {
                        if (err) {
                            res.send("Upload failed");
                        }
                    });
                    const query = folder_path_ + "/" + filename;

                    const addtoDatabase = await dbService.addPicture(req.body.id, query)
                }
            }
            res.send("OK")
        } else {
            res.send("ERROR")
        }


    } catch (error) {
        res.sendStatus(400, "Something went wrong");
    }
});



routes.get('/pictures/:id', async(req, res) => {
    try {
        const answer = await dbService.getPicture(req.params.id);
        res.send(answer)
    } catch (error) {
        res.sendStatus(400, "something went wrong")
    }
});


routes.get('/reviewsByProdId/:id', async(req, res) => {
    try {

        if (!req.params.id)
            return res.send("please provide an id");

        const users = await dbService.getReviewsByProdID(req.params.id);
        return res.send(users);

    } catch (error) {
        console.log(error)
        return res.sendStatus(400, "Something went wrong");
    }
});
routes.post('/addReview', async(req, res) => {
    try {

        let mes = await dbService.addReview(req.body);
        if (mes) {
            res.send("Success")
        }

    } catch (error) {
        res.sendStatus(400, "Something went wrong");
    }
})

routes.delete('/deletePicture', async(req, res) => {
    try {

        let mes = await dbService.removePicture(req.body);

        if (mes) {
            res.send("Success")
        }

    } catch (error) {
        console.log(error)
        res.sendStatus(400, "Something went wrong");
    }
})

routes.delete('/deleteReview/:id', async(req, res) => {
    try {
        console.log(req.body)

        let re = await dbService.deleteReview(req.params.id);

        if (re) {
            res.send("Success")
        }

    } catch (error) {
        console.log(error)
        res.sendStatus(400, "Something went wrong");
    }
})
routes.put('/editreview', async(req, res) => {
    try {

        let mes = await dbService.updateReview(req.body);

        if (mes) {
            res.send("Success")
        }

    } catch (error) {
        res.sendStatus(400, "Something went wrong");
    }
})


routes.post('/search', async(req, res) => {
        try {

            //Magic inefficient shit
            let final_res = []
            let search_arg = req.body.searchString;
            const split_text = search_arg.split(" ");
            let prods = await dbService.getProducts();
            let filter = {}
            for (i in prods) {
                let prod = prods[i];
                if (!(filter.hasOwnProperty(prod.prodID))) {
                    filter[prod.prodID] = []
                }
                if (filter[prod.prodID].length == 0) {
                    filter[prod.prodID].push(prod)
                } else {
                    let found = false;
                    for (j in filter[prod.prodID]) {
                        let prod2 = filter[prod.prodID][j];
                        //  console.log(prod2)
                        if (prod.colorID === prod2.colorID) {
                            found = true;
                            break;
                        }
                    }
                    if (!found)
                        filter[prod.prodID].push(prod)
                }
            }


            let products = []
            for (id in filter) {
                for (id2 in filter[id]) {
                    let prod = filter[id][id2];
                    products.push(prod)
                }
            }

            let colorObj = await dbService.getColorObject();

            for (i in split_text) {
                let search_query = split_text[i].toLowerCase();
                if (search_query.length == 0)
                    break;
                for (j in products) {
                    let product = products[j];
                    let color = colorObj[product.colorID].colorName.toLowerCase()
                    let product_name = product.name.toLowerCase()
                    let category_name = product.categoryObject.category_name.toLowerCase()
                    let description = product.description.toLowerCase()
                    let spec = product.specification.toLowerCase()


                    const isColor = color.includes(search_query);
                    const isName = product_name.includes(search_query)
                    const isCategoryName = category_name.includes(search_query)
                    const isDescription = description.includes(search_query)
                    const isSpec = spec.includes(search_query)
                    let isTags = false;
                    let tags = product.tags.split(',')
                    for (t in tags) {
                        let tag = tags[t];
                        if (tag.includes(search_query)) {
                            isTags = true
                            break;
                        }
                    }

                    if (isColor || isName || isCategoryName || isTags || isDescription || isSpec) {
                        final_res.push(product)
                    }
                }



            }


            res.json(final_res)

        } catch (error) {
            console.log(error)
            console.log("Something went wrong")
        }

    }),


    routes.get('/allDeals', async(req, res) => {
        try {
            const prod = await dbService.getProductsDeal();
            res.send(prod);
        } catch (error) {
            res.sendStatus(400, "Something went wrong");
        }
    });



routes.post('/updateDeal', async(req, res) => {
    try {
        let deal = await dbService.updateDeal(req.body)
        res.send("OK")
    } catch (error) {
        res.sendStatus(400, "Something went wrong")
    }

})






module.exports = routes;