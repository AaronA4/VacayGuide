const express = require('express');
const app = express();
const configRoutes = require('./routes');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
var path = require('path');
const { decodeToken } = require('./middleware');

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

/**
 * Dummy Validation of session
 */
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
/**
 * Middleware Functionality for validating the token
 */
app.use('/invites*', decodeToken);
app.use('/schedules', decodeToken);
app.use('/login', decodeToken);
app.use('/signup', decodeToken);
app.use('/logout', decodeToken);
app.use('/changeUserPW', decodeToken);
app.use('/changeUserInfo', decodeToken);



configRoutes(app);

app.listen(port, ()=>{
  console.log(`We've now got a server! on port ${port}`);

});
