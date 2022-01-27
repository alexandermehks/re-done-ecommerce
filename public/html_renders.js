const app = require('express').Router();
const { request } = require('http');
const { response } = require('express');


/**
 * 
 * Renders the index.html file.
 * 
 * 
 */
app.get('/', async (req, res) => {
     try {
          res.sendFile(__dirname + '/index.html');

     }
     catch (error) {
          res.send("Something went wrong")
     }
})


/**
 * Renders the admin.html file.
 */
app.get('/admin', async (req, res) => {
     try {
          res.sendFile(__dirname + '/admin.html');
     }
     catch (error) {
          res.send("Something went wrong")
     }
})




/**
 * 
 *  Represents a book.
 * @constructor
 * @param {string} title - The title of the book.
 * @param {string} author - The author of the book.
 */
function Book(title, author) {

}


module.exports = app;
