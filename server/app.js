const express = require('express');
const app = express();
const configRoutes = require('./routes');
const bodyParser = require('body-parser');
const session = require('express-session');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
  name: 'AuthCookie',
  resave: false,
  saveUninitialized: true
})
);

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

configRoutes(app);

app.listen(3000, ()=>{
  console.log(`We've now got a server! on port 3000`);

});
