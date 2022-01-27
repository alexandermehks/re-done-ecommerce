const express = require('express');

const app = express();
const port = 3000;
const homepage = ('/public/index.html')



app.get('/', function (req, res) {
   //res.send('HomePage')
    res.sendFile(homepage, {root:__dirname});
});

app.listen(port, () => {
    console.log('Now listening on port ${port}');
});






