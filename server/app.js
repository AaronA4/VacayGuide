const express = require('express');
const app = express();
const configRoutes = require('./routes');
const bodyParser = require('body-parser')


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
configRoutes(app);

app.listen(3000, ()=>{
  console.log(`We've now got a server! on port 3000`);

});
