const sqllite3 = require('sqlite3');
const { open, Database } = require('sqlite');
const res = require('express/lib/response');

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


const getProducts = async () => {
     try {
          const dbConnection = await dbPromise;
          const users = await dbConnection.all("SELECT prodid, propid FROM product");
          return users;
     }
     catch (error) {
          res.sendStatus(400, "SOmething went wrong")
     }
};




const addProduct = async (data) => {
     try {
          console.log(data)
          const dbConnection = await dbPromise;
          if (data.table === "shoes") {
               const response = await dbConnection.run(`INSERT INTO ${data.table} (type) VALUES (?)`, [data.type]);
               const getType = await dbConnection.get(`SELECT type FROM ${data.table} WHERE propID = ${response.lastID}`);
               const addToProd = await dbConnection.run(`INSERT INTO product (propID, type) VALUES (?,?)`, [response.lastID, getType.type]);
               return response
          }
          else if (data.table === "tshirt") {
               const response = await dbConnection.run(`INSERT INTO ${data.table} (type) VALUES (?)`, [data.xd]);
               const getType = await dbConnection.get(`SELECT type FROM ${data.table} WHERE propID = ${response.lastID}`);
               const addToProd = await dbConnection.run(`INSERT INTO product (propID, type) VALUES (?,?)`, [response.lastID, getType.type]);
               return response
          }
          else if (data.table === "sweater") {
               const response = await dbConnection.run(`INSERT INTO ${data.table} (type) VALUES (?)`, [data.xd]);
               const getType = await dbConnection.get(`SELECT type FROM ${data.table} WHERE propID = ${response.lastID}`);
               const addToProd = await dbConnection.run(`INSERT INTO product (propID, type) VALUES (?,?)`, [response.lastID, getType.type]);
               return response
          }
          else if (data.table === "pants") {
               const response = await dbConnection.run(`INSERT INTO ${data.table} (type) VALUES (?)`, [data.xd]);
               const getType = await dbConnection.get(`SELECT type FROM ${data.table} WHERE propID = ${response.lastID}`);
               const addToProd = await dbConnection.run(`INSERT INTO product (propID, type) VALUES (?,?)`, [response.lastID, getType.type]);
               return response
          }
          else {
               res.sendStatus(400)
          }
     }
     catch (error) {
          res.sendStatus(400, "Something went wrong")
     }
}











module.exports = {
     getProducts: getProducts,
     addProduct: addProduct

}
