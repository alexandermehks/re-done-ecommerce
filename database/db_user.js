const sqllite3 = require('sqlite3');
const { open, Database } = require('sqlite');
const bcrypt = require('bcrypt');
const res = require('express/lib/response');
const { v4: uuidv4 } = require('uuid');



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
 * @returns {Users from the database}
 */
const getUsers = async() => {
    try {
        const dbConnection = await dbPromise;
        const users = await dbConnection.all("SELECT userID, role, name,email,password FROM user");
        return users;
    } catch (error) {
        res.sendStatus(400, "SOmething went wrong")
    }
};

const getUser = async(email) => {
    try {
        const dbConnection = await dbPromise;
        const user = await dbConnection.get(`SELECT userid, role, name, email, password FROM user WHERE email = (?)`, [email])
        return user
    } catch (error) {
        res.sendStatus(400, "User not found");
    }
}

const addUser = async(email, password, name) => {
    const id = uuidv4()
    try {
        const dbConnection = await dbPromise;
        if (name) {
            const user = await dbConnection.run(`INSERT INTO user (userID, email, password,name) VALUES (?,?,?,?)`, [id, email, password, name])
        } else {
            const user = await dbConnection.run(`INSERT INTO user (userID, email, password,name) VALUES (?,?,?,? )`, [id, email, password, "anonymous"])

        }
    } catch (error) {
        res.sendStatus(400, "something went wront")
    }
}


const comparePassword = async(email, password) => {
    try {
        const dbConnection = await dbPromise;
        const user = await dbConnection.get(`SELECT email,password FROM user WHERE email=(?)`, [email]);
        if (user) {
            console.log("USER FINNS")
            const compare = await bcrypt.compare(password, user.password)
            return compare
        } else {
            console.log("USER FINNS EJ")
            return false
        }


    } catch (error) {
        res.sendStatus(400, "Something went wrong")
    }

}
const getEmailFromEmailSub = async() => {
    try {
        const dbConnection = await dbPromise;
        const emails = await dbConnection.all(`SELECT email FROM email_sub`)
        return emails

    } catch (error) {
        res.sendStatus(400, "User not found");
    }
}

const addEmailToSub = async(email) => {
    try {
        const dbConnection = await dbPromise;
        const emailSub = await dbConnection.run('INSERT INTO email_sub (email) values (?)', [email]);
        return "ok"
    } catch (error) {
        res.sendStatus(400, "User not found");
    }
}


const deleteUsers = async(data) => {

    try {
        const dbConnection = await dbPromise;
        if (data) {

            const res = await dbConnection.run(`DELETE FROM user WHERE userID = ?`, [data.userID])
            console.log(data)
            return res;
        }


    } catch (error) {
        console.log(error)
        res.sendStatus(400, "something went wrong")
    }
}

const updateUser = async(data, password = 0) => {

    try {
        const dbConnection = await dbPromise;
        if (password == 0) {
            const res = await dbConnection.run(`UPDATE user SET role = ?, name = ?, email = ?, password=? WHERE userID = ?`, [data.role, data.name, data.email, password, data.userID, ])
            return res;
        } else {
            const res = await dbConnection.run(`UPDATE user SET role = ?, name = ?, email = ? WHERE userID = ?`, [data.role, data.name, data.email, data.userID, ])
            return res;
        }

        return res;


    } catch (error) {
        console.log(error)
        res.sendStatus(400, "something went wrontt")
    }
}



module.exports = {
    getUsers: getUsers,
    addUser: addUser,
    comparePassword: comparePassword,
    getUser: getUser,
    getEmailFromEmailSub: getEmailFromEmailSub,
    addEmailToSub: addEmailToSub,
    deleteUsers: deleteUsers,
    updateUser: updateUser,
}