const sqllite3 = require('sqlite3');
const { open, Database } = require('sqlite');



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

const getUsers = async () => {
     try {
          const dbConnection = await dbPromise;
          const users = await dbConnection.all("SELECT * FROM CUSTOMER");
          return users;
     }
     catch (error) {
          res.sendStatus(400, "SOmething went wrong")
     }
};


module.exports = {
     getUsers: getUsers,
}