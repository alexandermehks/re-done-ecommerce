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
        const colors = await dbConnection.all("SELECT colorID, hexColor FROM Colors");

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





/**
 * 
 * @returns All products from the database, combined with their category, as well as faked picture urls
 */
const getOnlyProducts = async() => {
    try {
        const dbConnection = await dbPromise;
        const products = await dbConnection.all("SELECT prodId, name, type, price, description, specification FROM product");
        const allColors = await getColors();
        for (i in products) {
            products[i]["allColors"] = allColors

            //Add pictures to product-object
            url = []
            const pictures = await getPicture(products[i].prodID);

            for (j in pictures) {
                url.push(pictures[j].pictureURL)
            }

            if (url.length == 0)
                url = ["images/product-placeholder.jpg"]
            products[i]["url"] = url;
            products[i]["pictures"] = pictures


            //Add placeholder img if no pictures
            if (pictures.length == 0)
                products[i]["pictures"] = [{ "picID": -1, "prodID": products[i].prodID, "pictureURL": "images/product-placeholder.jpg" }]

        }

        return products;
    } catch (error) {
        console.log(error)
        res.sendStatus(400, "SOmething went wrong")
    }
};




/**
 * 
 * @returns All products from the database, combined with their category, as well as faked picture urls
 */
const getProducts = async() => {
    try {
        const dbConnection = await dbPromise;
        const products = await dbConnection.all("SELECT prodId, name, type, price, description, specification FROM product");
        let res = await generateListOfProductTypes(products);
        return res;
    } catch (error) {
        console.log(error)
        res.sendStatus(400, "SOmething went wrong")
    }
};

const getProductsByProdID = async(prodID) => {
    try {
        const dbConnection = await dbPromise;
        const products = await dbConnection.all(`SELECT prodId, name, type, price, description, specification FROM product WHERE prodID = (?)`, [prodID]);
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

const generateListOfProductTypes = async(products) => {

    let res = [];

    const allColors = await getColors();

    await asyncForEach(products, async(product) => {
        const type = product.type;
        const prodID = product.prodID;
        prod2 = await getCategoryWithProdId(type, prodID)
        if (prod2.length > 0) {
            await asyncForEach(prod2, async(products2) => {
                let newprod = {...product, ...products2 };
                //Add fake picture urls


                url = []
                const pictures = await getPicture(newprod.prodID);
                for (j in pictures) {
                    url.push(pictures[j].pictureURL)
                }




                if (url.length == 0)
                    url = ["images/product-placeholder.jpg"]
                newprod["url"] = url;
                newprod["pictures"] = pictures

                /*
                url = [newprod.picURL, "https://img01.ztat.net/article/spp-media-p1/c4004b7903d8445bad554014ee9e7c3d/c57641fc1ae447baa8bde94d06264369.jpg?imwidth=1800",
                    "https://img01.ztat.net/article/spp-media-p1/fc586e33b65340f7a7105c61c12f775d/bea3bb549a434e68b8f35798ef3ed647.jpg?imwidth=1800&filter=packshot",
                    "https://img01.ztat.net/article/spp-media-p1/cf9fed4fe4554ccfa488da8316a403c1/967dbf8a0962480cb251112e9f839f8f.jpg?imwidth=1800",
                    "https://img01.ztat.net/article/spp-media-p1/1b9b29b7abe548c493c4d8f67b096961/82d6b4ce6f0d494ab99751a208f8aa31.jpg?imwidth=1800"
                ]
                newprod["url"] = url;
                newprod["allColors"] = allColors*/
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
        const response = await dbConnection.run(`INSERT INTO product (prodId, name, type, price, description, specification) VALUES (?,?,?,?,?,?)`, [data.prodID, data.name, data.type, data.price, data.description, data.specification])
        return response, data.prodID

    } catch (error) {
        res.sendStatus(400, "Something went wrong")
    }
}

//Edit "BARA product"
const editProduct = async(data) => {
    try {
        const dbConnection = await dbPromise;

        console.log("EDIT into db", [data.prodID, data.name, data.type, data.price, data.description, data.specification])
        const response = await dbConnection.run(`UPDATE product SET name = ?, price = ?, description = ?, specification = ? WHERE prodID = ?`, [data.name, data.price, data.description, data.specification, data.prodID])
        return response

    } catch (error) {
        res.sendStatus(400, "Something went wrong")
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

                if (['shoes', 'sweater', 'pants', 'tshirt'].includes(data.type)) {
                    console.log("Inserted into db", [data.propID, data.prodID, data.colorID, data.balance, data.size, data.picURL])
                    const response = await dbConnection.run(`INSERT INTO ${data.type} (propID, prodID, colorID, balance, size, picURL) VALUES (?,?,?,?,?,?)`, [data.propID, data.prodID, data.colorID, data.balance, data.size, data.picURL])
                    return response
                }

                res.send("OK")
            } else {
                res.send("ERROR")
            }


        } catch (error) {
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


const addPicture = async(propID, file) => {
    try {
        const dbConnection = await dbPromise;
        const response = await dbConnection.run(`INSERT INTO pic (propID, pictureURL) VALUES (?,?)`, [propID, file])
        return response
    } catch (error) {
        res.sendStatus(400, "cant add picture")
    }
};

const getPicture = async(propID) => {
    try {
        const dbConnection = await dbPromise;
        const response = await dbConnection.all(`SELECT * FROM pic WHERE propID = (?)`, [propID]);
        return response

    } catch (error) {
        res.sendStatus(400, "cant get picture")
    }
};



const getReviewsByProdID = async(prodID) => {
    try {
        const dbConnection = await dbPromise;
        const res = await dbConnection.all("SELECT reviewID, prodID, userID, ratingnumber, comment FROM reviews WHERE prodID = (?)", [prodID]);
        for (let i = 0; i < res.length; i++) {

            let name = await getUserNameByReviews(res[i].userID);
            res[i].userID = name[0]['name']
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
        const res = await dbConnection.all("SELECT name FROM user WHERE userID = (?)", [userID]);

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
            const res = await dbConnection.run("INSERT INTO reviews(prodID, userID, ratingnumber, comment) VALUES(?,?,?,?)", [review.prodID, review.userID, review.ratingnumber, review.comment])
        }
        return res;
    } catch (error) {
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
    getProductPropertiesByProdAndColorID: getProductPropertiesByProdAndColorID,
    getAllProductsWithPropertiesByIdAndColor: getAllProductsWithPropertiesByIdAndColor,
    removeProduct: removeProduct,
    removeProperty: removeProperty,
    getReviewsByProdID: getReviewsByProdID,
    addReview: addReview


}