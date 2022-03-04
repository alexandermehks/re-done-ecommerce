require('dotenv').config()
const express = require('express');
const path = require('path')
const bodyParser = require('body-parser');
var session = require('express-session');
//Filesystem that ables to read a file
const fs = require('fs');
const upload = require('express-fileupload')

const app = express();
const port = 3000;

const user_routes = require('./routes/user_routes')
const prod_routes = require('./routes/product_routes')
const auth_routes = require('./routes/authentication')

//Setting statick folder and removing the .html in the end of the file. 
app.use(express.static(path.join(__dirname, 'public/index'), { extensions: ['html'] }));
app.use(express.static(path.join(__dirname, 'public/admin'), { extensions: ['html'] }));
app.use(express.static(path.join(__dirname, 'public/picture'), { extensions: ['html'] }));
app.use(express.static(path.join(__dirname, 'public/register'), { extensions: ['html'] }));
app.use(express.static('uploads'));


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
     secret: process.env.SECRET,
     resave: true,
     saveUninitialized: true,
     cookie: { secure: true },
     httpOnly: false,
}))
app.use(upload())

//Default routing for user routes will be /user
app.use('/user', user_routes);
app.use('/products', prod_routes);
app.use('/auth', auth_routes);

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