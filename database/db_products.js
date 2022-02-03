const sqllite3 = require('sqlite3');
const { open, Database } = require('sqlite');
const res = require('express/lib/response');
const { v4: uuidv4 } = require('uuid');
const { redirect } = require('express/lib/response');

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
const getProducts = async() => {
    try {
        const dbConnection = await dbPromise;
        const users = await dbConnection.all("SELECT prodid, propid, type FROM product");
        return users;
    } catch (error) {
        res.sendStatus(400, "SOmething went wrong")
    }
};

/**
 * 
 * @returns All products from the database, combined with their category, as well as faked picture urls
 */
const getProductsJohan = async() => {
    try {
        const dbConnection = await dbPromise;
        const products = await dbConnection.all("SELECT prodid, propid, type FROM product");

        let res = [];
        await asyncForEach(products, async(product) => {
            const cat = product.type;
            const propID = product.propID;
            prod2 = await getCategoryWithId(cat, propID)

            if (prod2.length > 0) {
                let newprod = {...product, ...prod2[0] };

                //Add fake picture urls
                url = ["https://img01.ztat.net/article/spp-media-p1/c4004b7903d8445bad554014ee9e7c3d/c57641fc1ae447baa8bde94d06264369.jpg?imwidth=1800",
                    "https://img01.ztat.net/article/spp-media-p1/fc586e33b65340f7a7105c61c12f775d/bea3bb549a434e68b8f35798ef3ed647.jpg?imwidth=1800&filter=packshot",
                    "https://img01.ztat.net/article/spp-media-p1/cf9fed4fe4554ccfa488da8316a403c1/967dbf8a0962480cb251112e9f839f8f.jpg?imwidth=1800",
                    "https://img01.ztat.net/article/spp-media-p1/1b9b29b7abe548c493c4d8f67b096961/82d6b4ce6f0d494ab99751a208f8aa31.jpg?imwidth=1800"
                ]
                newprod["url"] = url;
                res.push(newprod);

            }
        })
        return res;
    } catch (error) {
        res.sendStatus(400, "SOmething went wrong")
    }
};



/**
 * 
 * @param {Product objects} data 
 * @returns {Response from database} 
 */
const addProduct = async(data) => {
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
}

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
const getCategoryWithId = async(data, propID) => {
    const dbConnection = await dbPromise;
    //We can add if to check for what category we want to return if we dont want to use wildcard.
    const response = await dbConnection.all(`SELECT * FROM ${data} WHERE propID = (?)`, [propID])
    return response
}










module.exports = {
    getProducts: getProducts,
    getProductsJohan: getProductsJohan,
    addProduct: addProduct,
    getCategory: getCategory

}