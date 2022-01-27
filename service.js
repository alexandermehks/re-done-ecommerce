const express = require('express');

//Filesystem that ables to read a file
const fs = require('fs');

const app = express();
const port = 3000;
const homepage = ('/public/index.html')

const routes = require('./public/html_renders.js')



app.use(express.json());
app.use('/', routes);

//app.get('/', function (req, res) {
//res.send('HomePage')
//    res.sendFile(homepage, { root: __dirname });
//});

app.listen(port, () => {
     console.log('Now listening on port ' + port);
});






