const exp = require('constants');
const express = require('express');
const path = require('path')

//Filesystem that ables to read a file
const fs = require('fs');

const app = express();
const port = 3000;

//const routes = require('./public/html_renders.js')

//Setting statick folder and removing the .html in the end of the file. 
app.use(express.static(path.join(__dirname, 'public/index'), { extensions: ['html'] }));
app.use(express.static(path.join(__dirname, 'public/admin'), { extensions: ['html'] }));

app.use(express.json());
//app.use('/', routes);

//app.get('/', function (req, res) {
//res.send('HomePage')
//    res.sendFile(homepage, { root: __dirname });
//});

/**
 * Listening to port!
 */
app.listen(port, () => {
     console.log('Now listening on port ' + port);
});






