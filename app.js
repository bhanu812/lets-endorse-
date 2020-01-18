const mongoose = require('mongoose');
const express = require('express');
const app = express();
const path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors')
app.use(bodyParser.urlencoded({ extended: false }));  


var secret = require('./config/db');
var bodyParser = require('body-parser')

const users = require('./routes/users');

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

mongoose.connect(secret.database, { useNewUrlParser: true },function(err){
  if(err) throw err;
  console.log("Connected");
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");

    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    next();
  });
  var RateLimit = require('express-rate-limit');
  // important if behind a proxy to ensure client IP is passed to req.ip
  app.enable('trust proxy'); 
   
  var apiLimiter = new RateLimit({
    windowMs: 15*60*1000, // 15 minutes
    max: 100,
  });
   
  // only apply to requests that begin with /user/
app.use('/user/', apiLimiter);
app.use(express.json());
app.use('/api/users', users,apiLimiter);


//  const port = process.env.PORT ||3000 ;
const id   = process.env.ID;

app.get('/',(req,res)=>{
  res.send('lets-endorse assignment')
})
app.listen(secret.port, id, () => console.log(`Listening on port ${secret.port}...`, secret.database, secret.secretKey));
