const sqllite3 = require('sqlite3');
const { open, Database } = require('sqlite');
const res = require('express/lib/response');
const { v4: uuidv4 } = require('uuid');


const dbPromise = (async () => {
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
const getProducts = async () => {
     try {
          const dbConnection = await dbPromise;
          const users = await dbConnection.all("SELECT prodid, propid,type FROM product");
          return users;
     }
     catch (error) {
          res.sendStatus(400, "SOmething went wrong")
     }
};



/**
 * 
 * @param {Product objects} data 
 * @returns {Response from database} 
 */
const addProduct = async (data) => {
     try {
          const id_propID = uuidv4()
          const id_prodID = uuidv4()
          const dbConnection = await dbPromise;
          if (data.table === "shoes") {
               const response = await dbConnection.run(`INSERT INTO ${data.table} (propID,type,name, price,description, color, balance)  VALUES (?,?,?,?,?,?,? )`, [id_propID, data.type, data.name, data.price, data.description, data.color, data.balance]);
               const getType = await dbConnection.get(`SELECT type FROM ${data.table} WHERE propID = (?)`, [id_propID]);
               const addToProd = await dbConnection.run(`INSERT INTO product (prodID ,propID, type) VALUES (?,?,?)`, [id_prodID, id_propID, getType.type]);
               return response, addToProd
          }
          else if (data.table === "tshirt") {
               const response = await dbConnection.run(`INSERT INTO ${data.table} (propID,type, name,price,description,color, balance) VALUES (?,?,?,?,?,?,?)`, [id_propID, data.type, data.name, data.price, data.description, data.color, data.balance]);
               const getType = await dbConnection.get(`SELECT type FROM ${data.table} WHERE propID = (?)`, [id_propID]);
               const addToProd = await dbConnection.run(`INSERT INTO product (prodID ,propID, type) VALUES (?,?,?)`, [id_prodID, id_propID, getType.type]);
               return response, addToProd
          }
          else if (data.table === "sweater") {
               const response = await dbConnection.run(`INSERT INTO ${data.table} (propID,type,name,price,description,color,balance) VALUES (?,?,?,?,?,?,?)`, [id_propID, data.type, data.name, data.price, data.description, data.color, data.color]);
               const getType = await dbConnection.get(`SELECT type FROM ${data.table} WHERE propID = (?)`, [id_propID]);
               const addToProd = await dbConnection.run(`INSERT INTO product (prodID ,propID, type) VALUES (?,?,?)`, [id_prodID, id_propID, getType.type]);
               return response, addToProd
          }
          else if (data.table === "pants") {
               const response = await dbConnection.run(`INSERT INTO ${data.table} (propID,type,name,price,description,color,balance) VALUES (?,?,?,?,?,?,?)`, [id_propID, data.type, data.name, data.price, data.description, data.color, data.balance]);
               const getType = await dbConnection.get(`SELECT type FROM ${data.table} WHERE propID = (?)`, [id_propID]);
               const addToProd = await dbConnection.run(`INSERT INTO product (prodID ,propID, type) VALUES (?,?,?)`, [id_prodID, id_propID, getType.type]);
               return response, addToProd
          }
          else {
               res.sendStatus(400)
          }
     }
     catch (error) {
          res.sendStatus(400, "Something went wrong")
     }
}


const getCategory = async (data) => {
     const dbConnection = await dbPromise;
     //We can add if to check for what category we want to return if we dont want to use wildcard.
     const response = await dbConnection.all(`SELECT * FROM ${data}`)
     return response


}











module.exports = {
     getProducts: getProducts,
     addProduct: addProduct,
     getCategory: getCategory

}
