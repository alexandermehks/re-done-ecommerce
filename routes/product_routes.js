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

            if (!req.files.length) {
                console.log("HÄR")
            }
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


routes.post('/search', async(req, res) =>{
    try{
        let obj = {

        }

        let search_arg = req.body.searchString;
        const split_text = search_arg.split(" ");
        
        let ans = await dbService.getProducts();

        // category name = ans[1].categoryObject.category_name
        // description = ans[1].categoryObject.description

        for(let i = 0; i < ans.length; i++){
            for(let j = 0; j < split_text.length; j++){

                //Easy to add more search arguments.
                let category_name = ans[i].categoryObject.category_name.toLowerCase().includes(split_text[j].toLowerCase());
                let category_description = ans[i].categoryObject.description.toLowerCase().includes(split_text[j].toLowerCase());
                let prod_name = ans[i].name.toLowerCase().includes(split_text[j].toLowerCase());
                let description = ans[i].description.toLowerCase().includes(split_text[j].toLowerCase());

                if(category_name || category_description || prod_name|| description){
                    obj[i] = ans[i];
                }
            }

        }
        res.json(obj)

    } catch(error){
        console.log("Something went wrong")
    }

}),


routes.get('/singleproduct/:id', async(req, res) => {
    try{
        console.log(req.params)
        const products = await dbService.getProductsByProdID(req.params.id);
        console.log("Bajs")
        res.redirect('/singleproduct/'+req.params.id)
        console.log("Bajs2")

    }

    catch(error){
        res.sendStatus(400, "something went wrong")
    }
})






module.exports = routes;