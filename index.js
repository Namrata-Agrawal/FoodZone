/*const express = require('express');
const cors = require("cors");
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());
*/
var sqlite3 = require('sqlite3').verbose();
var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var ratelimit = require("express-rate-limit");

var app = express();

var server = http.createServer(app);
const limiter = ratelimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max:100 // limit each IP to 100 requests per windowMs

});

var db = new sqlite3.Database('order.db',sqlite3.OPEN_READWRITE,(err)=> {
    if(err){
        return  console.error(err.message);
    }

    console.log('Connected to the in-memory SQLITE database');


});

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'./main')));

//app.use(express.static(path.join(__dirname,'./images')));
app.use(helmet());
app.use(limiter);

db.run('CREATE TABLE IF NOT EXISTS customer(fullname TEXT , email TEXT)');

app.get('/', function(req,res){
    res.sendFile(path.join(__dirname,'./main/index.html'))
});


app.post('/add',function(req,res){
    db.serialize(()=>{
        db.run('INSERT INTO customer(fullname,email) VALUES (?,?)',[req.body.fullname, req.body.email],function(err){
            if(err){
                return console.log(err.message);
            }
            console.log("New order has been taken !");
            //res.send("New order has been added into database with name"+ req.body.fullname + " and email id"+ req.body.email);
            res.sendFile(path.join(__dirname,'./main/test.html'));
        });
    });
});

//close the database
/*
db.close((err)=> {
    if(err){
        return console.error(err.message);
    }
    console.log('close the database connection');
});
*/



//closing the database connection on request

app.get('/close',function(req,res){
    db.close((err)=>{
        if (err){
            res.send('There is some error in closing the database');
            return console.error(err.message);

        }

        console.log("closing the database connection ");
        res.send("Database connection successfully closed");
    });
});

server.listen(3000,function(){
    console.log("server is listening on port:3000");
});