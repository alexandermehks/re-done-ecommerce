const sqllite3 = require('sqlite3');
const { open, Database } = require('sqlite');
const res = require('express/lib/response');
const { v4: uuidv4 } = require('uuid');
const { redirect } = require('express/lib/response');
const fs = require('fs');

//Async for each
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

const dbPromise = (async() => {
    try {
        return open({
            filename: __dirname + '/database.db',
            driver: sqllite3.Database
        });
    } catch (error) {
        console.log(error)
        throw new error('DB CONNECTION FAILED');
    }
})();

/**
 * 
 * @returns All products from the database
 */
/*const getProducts = async() => {
    try {
        const dbConnection = await dbPromise;
        const users = await dbConnection.all("SELECT prodid, propid, type FROM product");
        return users;
    } catch (error) {
        res.sendStatus(400, "SOmething went wrong")
    }
};*/


const getColors = async() => {
    try {
        const dbConnection = await dbPromise;
        const colors = await dbConnection.all("SELECT * FROM Colors");

        const colorObj = {}
        for (const i in colors) {
            const c = colors[i];
            colorObj[c.colorID] = c.hexColor;
        }
        return colorObj;
    } catch (error) {
        console.log(error)

    }
};

const getColorObject = async() => {
    try {
        const dbConnection = await dbPromise;
        const colors = await dbConnection.all("SELECT * FROM Colors");

        const colorObj = {}
        for (const i in colors) {
            const c = colors[i];
            colorObj[c.colorID] = c;
        }
        return colorObj;
    } catch (error) {
        console.log(error)

    }
};


const getPaginationObjectOnlyProducts = async(num_rows = 10) => {
    try {
        const dbConnection = await dbPromise;
        const numProducts = await dbConnection.all("SELECT Count(orders) FROM product");

        let n = 0;
        if (numProducts.length > 0) {
            n = numProducts[0]["Count(orders)"];
        }

        let numPages = parseInt(n / num_rows)

        let res = {
            "numProducts": n,
            "numPages": numPages + 1,
            "firstPage": 1,
            "lastPage": numPages + 1
        }
        return res;
    } catch (error) {
        console.log(error)
        res.sendStatus(400, "SOmething went wrong")
    }
}


/**
 * 
 * @returns All products from the database, combined with their category, as well as faked picture urls
 */
const getOnlyProducts = async(pagination = false, num_rows = 10, page_num = 1) => {

    try {

        const dbConnection = await dbPromise;
        let products = await dbConnection.all("SELECT * FROM product ORDER BY orders DESC");
        const allColors = await getColors();
        await asyncForEach(products, async(product) => {
            product["allColors"] = allColors

            //Add category do object
            product.categoryObject = await getCategoryWithId(product.catID);


            //Add pictures to product-object
            url = []
            const pictures = await getPicture(product.prodID);
            await asyncForEach(pictures, async(pic) => {
                url.push(pic.pictureURL)
            });

            if (url.length == 0)
                url = ["images/producty-placeholder.jpg"]
            product["url"] = url;
            product["pictures"] = pictures

            product.newPrice = product.price
            if (product.deal) {
                product.newPrice = product.price - product.price * (product.deal / 100);
            }

            //Add placeholder img if no pictures
            if (pictures.length == 0)
                product["pictures"] = [{ "picID": -1, "prodID": product.prodID, "pictureURL": "images/product-placeholder.jpg" }]

        });

        let paginationObject = await getPaginationObjectOnlyProducts(num_rows);

        //Pagination
        if (pagination) {
            if (page_num >= 1 && page_num <= paginationObject.numPages) {
                //Calculate start index and end-index
                let startIndex = (page_num - 1) * num_rows;
                let endIndex = startIndex + num_rows;

                if (startIndex < 0)
                    startIndex = 0
                if (endIndex >= products.length)
                    endIndex = products.length - 1

                products = products.splice(startIndex, num_rows)
                return products;
            } else {
                //Return 0 prods? Out of punds
                return []
            }
        } else {
            return products;
        }



    } catch (error) {
        console.log(error)
        res.sendStatus(400, "SOmething went wrong")
    }
};

//Get all categories
const getAllCategories = async() => {
    try {
        const dbConnection = await dbPromise;
        const categories = await dbConnection.all("SELECT * FROM category");
        let res = {}
        await asyncForEach(categories, async(category) => {
            if (category.isParentCategory == 1) {
                category["sub"] = []
                res[category.catID] = category;
            }
        });

        await asyncForEach(categories, async(category) => {
            if (category.isParentCategory != 1) {
                res[category.parentCategory]["sub"].push(category)
            }
        });

        return res;
    } catch (error) {
        console.log(error)
        res.sendStatus(400, "SOmething went wrong")
    }
};

const getCategoryWithId = async(catID) => {
    try {
        const dbConnection = await dbPromise;
        const category = await dbConnection.all(`SELECT * FROM category WHERE catID = (?)`, [catID]);



        if (category.length > 0) {
            const categoryParent = await dbConnection.all(`SELECT * FROM category WHERE catID = (?)`, [category[0].parentCategory]);
            category[0].parent_name = categoryParent[0].category_name;
            return category[0];
        } else return null;
    } catch (error) {
        console.log(error)
        res.sendStatus(400, "SOmething went wrong")
    }


}



/**
 * 
 * @returns All products from the database, combined with their category, as well as faked picture urls
 */
const getProducts = async() => {
    try {
        const dbConnection = await dbPromise;
        const products = await dbConnection.all("SELECT * FROM product ORDER BY orders DESC");
        let res = await generateListOfProductTypes(products);
        return res;
    } catch (error) {
        console.log(error)
        res.sendStatus(400, "SOmething went wrong")
    }
};

const getProductsByProdID = async(prodID, propID = -1) => {
    try {
        const dbConnection = await dbPromise;
        const products = await dbConnection.all(`SELECT * FROM product WHERE prodID = (?) ORDER BY orders DESC`, [prodID]);
        let res = await generateListOfProductTypes(products, propID);
        return res;
    } catch (error) {
        console.log(error)
        res.sendStatus(400, "SOmething went wrong")
    }
}

const getPropertyProductByPropID = async(propID) => {

    try {
        const dbConnection = await dbPromise;
        const products = await dbConnection.all(`SELECT * FROM product WHERE prodID = (?) ORDER BY orders DESC`, [prodID]);
        let res = await generateListOfProductTypes(products);
        return res;
    } catch (error) {
        console.log(error)
        res.sendStatus(400, "SOmething went wrong")
    }






}



const getAllProductsWithPropertiesByIdAndColor = async(prodID, colorID, type) => {
    try {
        const dbConnection = await dbPromise;

        const allProducts = await getOnlyProducts();
        const allColors = await getColors();
        let res = {};
        await asyncForEach(allProducts, async(prod) => {

            const prodID = prod.prodID;
            //let innerres = await getProductPropertiesByProdAndColorID(prod.);
            let outerres = {}
            for (colorID in allColors) {
                let tesinnerRes = await getProductPropertiesByProdAndColorID(prodID, colorID, prod.type)
                    //console.log("FAKK", tesinnerRes)
                outerres[colorID] = tesinnerRes;
            }

            res[prodID] = outerres;

            /*url = [newprod.picURL, "https://img01.ztat.net/article/spp-media-p1/c4004b7903d8445bad554014ee9e7c3d/c57641fc1ae447baa8bde94d06264369.jpg?imwidth=1800",
                "https://img01.ztat.net/article/spp-media-p1/fc586e33b65340f7a7105c61c12f775d/bea3bb549a434e68b8f35798ef3ed647.jpg?imwidth=1800&filter=packshot",
                "https://img01.ztat.net/article/spp-media-p1/cf9fed4fe4554ccfa488da8316a403c1/967dbf8a0962480cb251112e9f839f8f.jpg?imwidth=1800",
                "https://img01.ztat.net/article/spp-media-p1/1b9b29b7abe548c493c4d8f67b096961/82d6b4ce6f0d494ab99751a208f8aa31.jpg?imwidth=1800"
            ]*/
            //newprod["url"] = url;
            //newprod["allColors"] = allColors

        });



        return res;
    } catch (error) {
        console.log(error)
        res.sendStatus(400, "Something went wrong")
    }
}

const getProductPropertiesByProdAndColorID = async(prodID, colorID, type) => {
    try {
        const dbConnection = await dbPromise;
        const productProperties = await dbConnection.all(`SELECT * FROM ${type} WHERE prodID = ? AND colorID = ?`, [prodID, colorID]);

        for (i in productProperties) {
            productProperties[i].type = type;
        }
        let res = productProperties;
        return res;
    } catch (error) {
        console.log(error)
        res.sendStatus(400, "Something went wrong")
    }
}

const generateListOfProductTypes = async(products, proppID = -1) => {

    let res = [];

    const allColors = await getColors();

    await asyncForEach(products, async(product) => {
        const type = product.type;
        const prodID = product.prodID;
        const catID = product.catID
        prod2 = await getCategoryWithProdId(type, prodID)
        if (prod2.length > 0) {
            await asyncForEach(prod2, async(products2) => {
                let newprod = {...product, ...products2 };
                //Add fake picture urls


                url = []
                const pictures = await getPicture(newprod.prodID);
                await asyncForEach(pictures, async(pic) => {
                    url.push(pic.pictureURL)
                });

                newprod.newPrice = newprod.price
                if (newprod.deal) {
                    newprod.newPrice = newprod.price - newprod.price * (newprod.deal / 100);
                }



                if (url.length == 0)
                    url = ["images/product-placeholder.jpg"]
                newprod["url"] = url;
                newprod["pictures"] = pictures

                newprod.categoryObject = await getCategoryWithId(catID);
                if (proppID == -1 || proppID == newprod.propID)
                    res.push(newprod);
            });
        }
    })
    return res;


}

//Skapa "BARA product"
const addProduct = async(data) => {
    try {
        const id_prodID = uuidv4()
            //const id_prodID = uuidv4()
            //const id_size = uuidv4()
        const testEntry = {
            "prodID": id_prodID,
            "name": "Adidas Sneaker 3",
            "type": "shoes",
            "price": 1500,
            "description": "Very good shoe",
            "specification": "Made out of human babies"
        }
        data.prodID = id_prodID
        const dbConnection = await dbPromise;

        console.log("Inserted into db", [data.prodID, data.name, data.type, data.price, data.description, data.specification])
        const response = await dbConnection.run(`INSERT INTO product (prodId, name, type, price, description, specification, catID, tags) VALUES (?,?,?,?,?,?,?, ?)`, [data.prodID, data.name, data.type, data.price, data.description, data.specification, data.catID, data.tags])
        return response, data.prodID

    } catch (error) {
        console.log(error)
        res.sendStatus(400, "Something went wrong")
    }
}

//Edit "BARA product"
const editProduct = async(data) => {
    try {
        const dbConnection = await dbPromise;

        console.log("EDIT into db", [data.prodID, data.name, data.type, data.price, data.description, data.specification, data.tags])
        const response = await dbConnection.run(`UPDATE product SET name = ?, price = ?, description = ?, specification = ?, catID = ?, tags=? WHERE prodID = ?`, [data.name, data.price, data.description, data.specification, data.catID, data.tags, data.prodID])
        return response

    } catch (error) {
        console.log(error)
        res.sendStatus(400, "Something went wrong", error)
    }
}

const removeProduct = async(data) => {
    try {
        const dbConnection = await dbPromise;

        //console.log("EDIT into db", [data.prodID, data.name, data.type, data.price, data.description, data.specification])
        const response = await dbConnection.run(`DELETE FROM product WHERE prodID = ?`, [data.prodID])

        //Should remove folder with product-pictures
        const folder = './public/index/images/uploads/products/' + data.prodID;
        fs.rmSync(folder, { recursive: true, force: true });

        //Remove pictures from pic-db
        const response2 = await dbConnection.run(`DELETE FROM pic WHERE propID = ?`, [data.prodID])



        return response, response2
    } catch (error) {
        console.log(error)
        res.sendStatus(400, "Something went wrong")
    }
}


const addProductProperty = async(req) => {
    try {
        const id_propID = uuidv4()
            //const id_prodID = uuidv4()
            //const id_size = uuidv4()
        console.log(req.body.data);
        let data = JSON.parse(req.body.data)
        let files = req.files
        console.log(files)


        //FIRST TRY TO ADD FILE:
        const folder_path = './public/index/images/uploads/properties/' + id_propID;
        const folder_path_ = 'images/uploads/properties/' + id_propID;

        try {
            if (req.files) {

                //Create folder if not exists
                try {
                    if (!fs.existsSync(folder_path)) {
                        fs.mkdirSync(folder_path, { recursive: true });
                    }
                } catch (err) {
                    console.error(err);
                }
                let url = "images/product-placeholder.jpg"

                var file = req.files.file
                var filename = file.name
                const p = folder_path
                file.mv(p + "/" + filename, function(err) {
                    if (err) {
                        res.send("Upload failed");
                    }
                });
                const query = folder_path_ + "/" + filename;
                url = query

                data.picURL = url;
                // Add to database
                data.propID = id_propID
                const dbConnection = await dbPromise;

                if (['shoes', 'sweater', 'pants', 'tshirt', 'accesoaries'].includes(data.type)) {
                    console.log("Inserted into db", [data.propID, data.prodID, data.colorID, data.balance, data.size, data.picURL])
                    const response = await dbConnection.run(`INSERT INTO ${data.type} (propID, prodID, colorID, balance, size, picURL) VALUES (?,?,?,?,?,?)`, [data.propID, data.prodID, data.colorID, data.balance, data.size, data.picURL])
                    return response
                }

                res.send("OK")
            } else {
                res.send("ERROR")
            }


        } catch (error) {
            console.log(error)
            res.sendStatus(400, "Something went wrong");
        }


        /*
        const testEntry = {
                "propID": id_propID,
                "prodID": "61fca205-99f4-4ebf-adcf-064427170553",
                "type": "shoes",
                "colorID": 1,
                "balance": 100,
                "size": 42,
                "picUrl": "https://www.famousfootwear.com/blob/product-images/20000/50/17/2/50172_pair_large.jpg"
            }
            //data = testEntry
        data.propID = id_propID
        const dbConnection = await dbPromise;

        if (['shoes', 'sweater', 'pants', 'tshirt'].includes(data.type)) {

            console.log("Inserted into db", [data.propID, data.prodID, data.colorID, data.balance, data.size, data.picURL])
            const response = await dbConnection.run(`INSERT INTO ${data.type} (propID, prodID, colorID, balance, size, picURL) VALUES (?,?,?,?,?,?)`, [data.propID, data.prodID, data.colorID, data.balance, data.size, data.picURL])
            return response
        }*/
    } catch (error) {
        console.log("Error: ", error)
        res.sendStatus(400, "Something went wrong")
    }
}

//Remove Picture
//TODO: IF ID -1. DON'T REMOVE PLS
const removePicture = async(data) => {
    try {
        const dbConnection = await dbPromise;
        const response = await dbConnection.run(`DELETE FROM pic WHERE picID = ?`, [data.picID])

        //Should remove picture from folder as well
        console.log("Remove from folder", data)

        const path = "./public/index/" + data.pictureURL;
        console.log(path)
        fs.unlink(path, (err) => {
            if (err) {
                console.error(err)
                return
            }
            console.log("File was removed from system", path)
        })

        return response


    } catch (error) {
        console.log(error)
        res.sendStatus(400, "Something went wrong")
    }
}


//Remove Product
const removeProperty = async(data) => {
    try {
        const dbConnection = await dbPromise;
        //console.log("EDIT into db", [data.prodID, data.name, data.type, data.price, data.description, data.specification])
        const response = await dbConnection.run(`DELETE FROM ${data.type} WHERE propID = ?`, [data.propID])

        //Should remove map with picture
        const folder = './public/index/images/uploads/properties/' + data.propID;
        fs.rmSync(folder, { recursive: true, force: true });

        return response
    } catch (error) {
        console.log(error)
        res.sendStatus(400, "Something went wrong")
    }
}



/**
 * 
 * @param {Product objects} data 
 * @returns {Response from database} 
 */
/*const addProduct = async(data) => {
    try {
        const id_propID = uuidv4()
        const id_prodID = uuidv4()
        const id_size = uuidv4()
        const dbConnection = await dbPromise;
        if (data.table === "shoes") {
            const response = await dbConnection.run(`INSERT INTO ${data.table} (propID,type,name, price,description, color, balance)  VALUES (?,?,?,?,?,?,? )`, [id_propID, data.type, data.name, data.price, data.description, data.color, data.balance]);
            const insertSize = await dbConnection.run(`INSERT INTO size (sizeID,propID) VALUES (?,?)`, [id_size, id_propID]);
            const getType = await dbConnection.get(`SELECT type FROM ${data.table} WHERE propID = (?)`, [id_propID]);
            const addToProd = await dbConnection.run(`INSERT INTO product (prodID ,propID, sizeID, type) VALUES (?,?,?,?)`, [id_prodID, id_propID, id_size, getType.type]);
            return response, addToProd, insertSize
        } else if (data.table === "tshirt") {
            const response = await dbConnection.run(`INSERT INTO ${data.table} (propID,type, name,price,description,color, balance) VALUES (?,?,?,?,?,?,?)`, [id_propID, data.type, data.name, data.price, data.description, data.color, data.balance]);
            const insertSize = await dbConnection.run(`INSERT INTO size (sizeID, propID) VALUES (?,?)`, [id_size, id_propID]);
            const getType = await dbConnection.get(`SELECT type FROM ${data.table} WHERE propID = (?)`, [id_propID]);
            const addToProd = await dbConnection.run(`INSERT INTO product (prodID ,propID, sizeID, type) VALUES (?,?,?,?)`, [id_prodID, id_propID, id_size, getType.type]);
            return response, addToProd, insertSize
        } else if (data.table === "sweater") {
            const response = await dbConnection.run(`INSERT INTO ${data.table} (propID,type,name,price,description,color,balance) VALUES (?,?,?,?,?,?,?)`, [id_propID, data.type, data.name, data.price, data.description, data.color, data.color]);
            const insertSize = await dbConnection.run(`INSERT INTO size (sizeID, propID) VALUES (?,?)`, [id_size, id_propID]);
            const getType = await dbConnection.get(`SELECT type FROM ${data.table} WHERE propID = (?)`, [id_propID]);
            const addToProd = await dbConnection.run(`INSERT INTO product (prodID ,propID, sizeID, type) VALUES (?,?,?,?)`, [id_prodID, id_propID, id_size, getType.type]);
            return response, addToProd, insertSize
        } else if (data.table === "pants") {
            const response = await dbConnection.run(`INSERT INTO ${data.table} (propID,type,name,price,description,color,balance) VALUES (?,?,?,?,?,?,?)`, [id_propID, data.type, data.name, data.price, data.description, data.color, data.balance]);
            const insertSize = await dbConnection.run(`INSERT INTO size (sizeID, propID) VALUES (?,?)`, [id_size, id_propID]);
            const getType = await dbConnection.get(`SELECT type FROM ${data.table} WHERE propID = (?)`, [id_propID]);
            const addToProd = await dbConnection.run(`INSERT INTO product (prodID ,propID, sizeID,type) VALUES (?,?,?,?)`, [id_prodID, id_propID, id_size, getType.type]);
            return response, addToProd, insertSize
        } else {
            res.sendStatus(400)
        }
    } catch (error) {
        res.sendStatus(400, "Something went wrong")
    }
}*/

/**
 * 
 * @param {Category of a product} data 
 * @returns {Database objects that matches the category}
 */
const getCategory = async(data) => {
    const dbConnection = await dbPromise;
    //We can add if to check for what category we want to return if we dont want to use wildcard.
    const response = await dbConnection.all(`SELECT * FROM ${data}`)
    return response
}

/**
 * 
 * @param {Category of a product} data
 * @returns {Database objects that matches the category}
 */
const getCategoryWithProdId = async(type, prodID) => {
    const dbConnection = await dbPromise;
    //We can add if to check for what category we want to return if we dont want to use wildcard.
    const response = await dbConnection.all(`SELECT * FROM ${type} WHERE prodID = (?)`, [prodID])
    return response
}

const getCategoryWithPropId = async(type, propID) => {
    const dbConnection = await dbPromise;
    const response = await dbConnection.all(`SELECT * FROM ${type} WHERE propID = (?)`, [propID])




    return response
}


const addPicture = async(propID, file) => {
    try {
        const dbConnection = await dbPromise;
        const response = await dbConnection.run(`INSERT INTO pic (propID, pictureURL) VALUES (?,?)`, [propID, file])
        return response
    } catch (error) {
        console.log(error)
        res.sendStatus(400, "cant add picture")
    }
};

const getPicture = async(propID) => {
    try {
        const dbConnection = await dbPromise;
        const response = await dbConnection.all(`SELECT * FROM pic WHERE propID = (?)`, [propID]);
        return response

    } catch (error) {
        console.log(error)
        res.sendStatus(400, "cant get picture")
    }
};



const getReviewsByProdID = async(prodID) => {
    try {
        const dbConnection = await dbPromise;
        const res = await dbConnection.all("SELECT reviewID, prodID, userID, ratingnumber, comment,date FROM reviews WHERE prodID = (?)", [prodID]);
        for (let i = 0; i < res.length; i++) {

            let name = await getUserNameByReviews(res[i].userID);
            res[i].name = name[0]['name']
            res[i].userID = name[0]['userID']
        }

        return res;
    } catch (error) {
        console.log(error)
        res.sendStatus(400, "SOmething went wrong")
    }
}
const getUserNameByReviews = async(userID) => {
    try {

        const dbConnection = await dbPromise;
        const res = await dbConnection.all("SELECT name,userID FROM user WHERE userID = (?)", [userID]);

        return res;
    } catch (error) {
        console.log(error)
        res.sendStatus(400, "SOmething went wrong")
    }
}
const addReview = async(review) => {
    console.log(review)
    try {
        const dbConnection = await dbPromise;
        if (review) {
            const res = await dbConnection.run("INSERT INTO reviews(prodID, userID, ratingnumber, comment,date) VALUES(?,?,?,?,?)", [review.prodID, review.userID, review.ratingnumber, review.comment, review.date])
        }
        return res;
    } catch (error) {
        console.log(error)
        res.sendStatus(400, "something went wrontt")
    }
}
const deleteReview = async(data) => {

    try {
        const dbConnection = await dbPromise;
        if (data) {

            const res = await dbConnection.run(`DELETE FROM reviews WHERE reviewID = ?`, [data])
            console.log(data)
        }
        return res;
    } catch (error) {
        console.log(error)
        res.sendStatus(400, "something went wrontt")
    }
}
const updateReview = async(data) => {

    try {
        const dbConnection = await dbPromise;
        if (data) {

            const response = await dbConnection.run(`UPDATE reviews SET ratingnumber = ?, comment = ? WHERE reviewID = ?`, [data.ratingnumber, data.comment, data.reviewID])

            console.log(data)
        }
        return res;
    } catch (error) {
        console.log(error)
        res.sendStatus(400, "something went wrontt")
    }
}

const searchBar = async(search) => {
    console.log(search)
    try {
        const dbConnection = await dbPromise;
        const res = await dbConnection.run

    } catch (error) {
        console.log(error)
        res.sendStatus(400, "something went wrong")
    }

}


const getProductsDeal = async() => {
    try {
        const dbConnection = await dbPromise;
        const products = await dbConnection.all("SELECT * FROM product WHERE deal > 0 ORDER BY orders DESC");
        let res = await generateListOfProductTypes(products);
        return res;
    } catch (error) {
        console.log(error)
        res.sendStatus(400, "SOmething went wrong")
    }
};


const updateDeal = async(data) => {
    try {
        console.log(data)
        const dbConnection = await dbPromise;
        const deals = await dbConnection.run(`UPDATE product set deal = ? WHERE prodID = ?`, [data.dealAmount, data.prodID])
        return deals;
    } catch (error) {
        res.sendStatus(400, "Something went wrong")
    }
}

const fillOrderProducts = async(orders) => {

    const dbConnection = await dbPromise;
    await asyncForEach(orders, async(order) => {
        let orderProducts = await dbConnection.all(`SELECT * from orderproducts WHERE orderID = ?`, [order.orderID])
        order.products = orderProducts;
        order.totalPrice = 0;
        order.totalItems = 0;
        await asyncForEach(order.products, async(product) => {
            //console.log(product.propID, product.type)
            order.totalItems += product.amount;
            let property = await getCategoryWithPropId(product.type, product.propID);
            if (property.length > 0) {
                let prop = property[0];
                let prod = await getProductsByProdID(prop.prodID, product.propID);
                //console.log(prod)
                if (prod.length > 0) {
                    product.productObject = prod[0]

                    order.totalPrice += product.productObject.newPrice * product.amount;
                }
            }
        });

    });
    return orders;
}







const getOrdersByUserID = async(userID) => {

    try {

        console.log("Orders: ", userID)

        const dbConnection = await dbPromise;
        let orders = await dbConnection.all(`SELECT * from orders WHERE userID = ? ORDER BY date DESC`, [userID])
        orders = await fillOrderProducts(orders);
        return orders;
    } catch (error) {
        console.log(error)
        res.sendStatus(400, "Something went wrong")
    }

}

const getOrdersByOrderID = async(orderID) => {
    try {

        console.log("Orders: ", orderID)

        const dbConnection = await dbPromise;
        let orders = await dbConnection.all(`SELECT * from orders WHERE orderID = ? ORDER BY date DESC`, [orderID])
        orders = await fillOrderProducts(orders);
        return orders;
    } catch (error) {
        console.log(error)
        res.sendStatus(400, "Something went wrong")
    }
}

const getOrders = async() => {
    try {

        const dbConnection = await dbPromise;
        let orders = await dbConnection.all(`SELECT * from orders`)
        orders = await fillOrderProducts(orders);
        return orders;
    } catch (error) {
        console.log(error)
        res.sendStatus(400, "Something went wrong")
    }
}

const addOrders = async(loggedin) => {
    //status -> recieved, packing,sent
    try {
        const dbConnection = await dbPromise;
        //const orders = await dbConnection.run(`SELECT * from orders WHERE orderID = ?`, [orderID])
        //UPDATE
        let userID = loggedin.id;
        let shoppingcart = loggedin.shoppingcart;
        let userEmail = loggedin.email;
        if (shoppingcart) {
            if (Object.keys(shoppingcart).length > 0) {
                console.log(shoppingcart)

                console.log("EMAILHASDAD", userEmail)
                const response = await dbConnection.run(`INSERT INTO orders (userID, status) VALUES (?,?)`, [userEmail, "Recieved"])

                const orderID = response.lastID;

                //Loop through every item in cart and add
                for (let propID in shoppingcart) {
                    let prod = shoppingcart[propID];
                    let propIDD = prod.propID;
                    let amount = prod.amount;
                    const type = prod.type;

                    const response2 = await dbConnection.run(`INSERT INTO orderproducts (propID, orderID, amount, type) VALUES (?,?,?,?)`, [propIDD, orderID, amount, type])
                }
                return response;
            }
        }
        return "You can't checkout without any items in cart"
    } catch (error) {
        console.log(error)
        return error;
    }
}

const editOrderStatus = async(orderID, status) => {
    try {
        const dbConnection = await dbPromise;

        const response = await dbConnection.run(`UPDATE orders SET status = ? WHERE orderID = ?`, [status, orderID])

        return response;
    } catch (error) {
        console.log(error)
        return error;

    }
}



const deleteOrder = async(orderID) => {

    try {
        const dbConnection = await dbPromise;


        const res = await dbConnection.run(`DELETE FROM orderProducts WHERE orderID = ?`, [orderID])
        const res2 = await dbConnection.run(`DELETE FROM orders WHERE orderID = ?`, [orderID])

        return res;
    } catch (error) {
        console.log(error)
        res.sendStatus(400, "something went wrontt")
    }
}






module.exports = {

    getProducts: getProducts,
    getOnlyProducts: getOnlyProducts,
    getProductsByProdID: getProductsByProdID,
    addProduct: addProduct,
    editProduct: editProduct,
    addProductProperty: addProductProperty,
    getCategory: getCategory,
    addPicture: addPicture,
    getPicture: getPicture,
    removePicture: removePicture,
    getColors: getColors,
    getColorObject: getColorObject,
    getProductPropertiesByProdAndColorID: getProductPropertiesByProdAndColorID,
    getAllProductsWithPropertiesByIdAndColor: getAllProductsWithPropertiesByIdAndColor,
    removeProduct: removeProduct,
    removeProperty: removeProperty,
    getReviewsByProdID: getReviewsByProdID,
    addReview: addReview,
    getAllCategories: getAllCategories,
    deleteReview: deleteReview,
    updateReview: updateReview,
    searchBar: searchBar,
    getProductsDeal: getProductsDeal,
    updateDeal: updateDeal,
    getOrdersByUserID: getOrdersByUserID,
    getOrdersByOrderID: getOrdersByOrderID,
    addOrders: addOrders,
    editOrderStatus: editOrderStatus,
    deleteOrder: deleteOrder,
    getOrders: getOrders,
    getPaginationObjectOnlyProducts: getPaginationObjectOnlyProducts


}