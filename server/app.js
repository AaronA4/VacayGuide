const express = require('express');
const app = express();
const configRoutes = require('./routes');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
var path = require('path');

const port = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.use(cors({
  credentials: true,
  origin: "http://localhost:3000",
}));


app.use(session({
  name: 'AuthCookie',
  resave: false,
  secret: "Secert",
  saveUninitialized: true
})
);

// app.use('/schedules',middleware.decodeToken);

app.use(async (req, res, next) => {
  let date = new Date().toUTCString();
  let authStr;
  if(!req.session.user){
      authStr = "(Non-Authenticated User)";
  }else{
      authStr = "(Authenticated User)";
  }
  console.log(`[${date}]: ${req.method} ${req.originalUrl} ${authStr}`);
  next();
});

var public = path.join(__dirname, '/public');
app.use("/public", express.static(public));

configRoutes(app);

app.listen(port, ()=>{
  console.log(`We've now got a server! on port ${port}`);

});
