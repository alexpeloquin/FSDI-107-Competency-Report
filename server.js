var http = require("http");
var express = require("express");
var app = express(); //Express has biggest impact of how we manage the requests

//Configuration Sections
var bparse = require("body-parser");
app.use(bparse.json());

//enable CORS for testing purposes
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "Get,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,Accept");
    next();
});

//Sever HTML files to client
app.set("views",__dirname + "/views");
var ejs = require("ejs");
app.engine("html",ejs.renderFile);
app.set("view engine", "ejs");

//Serve static files (css, js, images, sounds, video)
app.use(express.static(__dirname+"/views"));

//Object contructor for the mongo schema
var Item;

//valid roots defined

app.get("/",function(req,res){
    res.render("index.html");
});
app.get("admin",function(req,res){
    res.render("admin.html");
});
app.get("/about",function(render,res){
    res.send("A project from Alexander Peloquin");
});
app.get("/error",function(req,res){
    res.status(401);
    res.send("A super hard error occured");
});

//API/test for Mongo :: Test endpoint to create and store an object on Mongo

app.get("API/test",function(req,res){
    var testItem = new Item({
        brand:"superduper",
        desc:"This is just a test",
        price: 42,
        image: "",
        cat:"testing items",
        user:"Alexander",
    });
//save the object as a document on the collection
//save the object as an entry on the table (SQL term)
    testItem.save(function(err,resultObj){
        if(err){
            console.log("Error saving obj");
            res.status(500);
            res.send("error, could not save the obect onto DB");
        }
//object saved
        res.send("Object Saved")
    });
});

//API/points

var count = 1;

app.get("/API/points",function(req,res){
//read data from DB
//Item.find is the mongoose model we established
//find is a built in function
    Item.find({},function(err,data){
        if(err){
            console.log("Error getting data");
            console.log(err);
            res.status(500);
            res.json(err);
        }
//sends data back to client
        res.json(data);
    });
});

app.post("/API/points",function(req,res){
    console.log("Post received! " + req.body);
    var itemFromClient = req.body; //catch the object from client
//create mongo item
    var itemMongo = new Item(itemFromClient);
    itemMongo.save(function(error,itemSaved){
        if(error){
            console.log("error saving the item");
            console.log(error);
            res.status(500);
            res.json(error);
        }
//Need to fix object because client expects an id attribute
        itemSaved.id=itemSave._id;
//created
        res.status(201);
        res.json(itemSaved)
    });
});

//Delete and object from the DB
app.delete("/API/points",function(req,res){
    var item = req.body;
    Item.deleteOne({__id:item.removeId},function(err){
        if(err){
            console.log("error deleting item");
            res.status(500);
            res.json(err);
        }
        res.send("ok");
    });
});

app.delete("/API/points/many",function(req,res){
    var item = req.body;
    Item.deleteMany({user:item.removeUser},function(err){
        if(err){
            console.log("error deleting items");
            res.status(500);
            res.json(err);
        }
        res.send("ok");
    });
});

//Mongo Configuration

var mongoose = require("mongoose");
mongoose.connect("mongodb://ThiIsAPassword:TheRealPassword@cluster0-shard-00-00-euadh.mongodb.net:27017,cluster0-shard-00-01-euadh.mongodb.net:27017,cluster0-shard-00-02-euadh.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin",{
    userMongoClient: true
});

var db = mongoose.connection;

db.on("error",function(error){
    console.log("Error connection to the DB is not established");
})

db.on("open",function(){
    console.log("DB connection open");
//create the schemae for the collection(s)
    var itemSchema = mongoose.Schema({
        user:String,
        brand:String,
        des:String,
        price:Number,
        image:String,
        cat:String,
    });
    Item = mongoose.model("Items107",itemSchema);
});

//Ends Mongo Configuration

app.get("*",function(req,res){
    res.render("404.html");
})
app.listen(8081,function(){
    console.log("Server started on localhost:8081");
})