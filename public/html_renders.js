const app = require('express').Router();
const { request } = require('http');
const { response } = require('express');




app.get('/', async (req, res) => {
     try {
          res.sendFile(__dirname + '/index.html');

     }
     catch (error) {
          res.send("Something went wrong")
     }
})

app.get('/admin', async (req, res) => {
     try {
          res.sendFile(__dirname + '/admin.html');
     }
     catch (error) {
          res.send("Something went wrong")
     }
})


module.exports = app;