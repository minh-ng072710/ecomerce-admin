//express
var express = require("express");
var app = express();
app.set("view engine", "ejs");
app.set("views", "./Views");
app.use(express.static("Public"));
var moment = require('moment')
//body-parser
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

//multer
var multer = require("multer");
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "Public/Upload")
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname)

    }
});                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
var Upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file.size);
        var a = file.mimetype.split('/');
        var b = a[0];
        if (b == "image") {
            cb(null, true);
        } else {
            return cb(new Error("Only upload Image!!!!!!"));
        }
    }
}).single("image");

//-----------------------------Connect FireStore----------------------------//

const admin = require('firebase-admin');

let serviceAccount = require('./sdk.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

const util = require('util');
console.log(util.inspect('index.js', { showHidden: false, depth: null }));
//-----------------------------Connect FireStore----------------------------//

//-----------------------------Port Option----------------------------//
app.listen(process.env.PORT || 3000)

//-----------------------------Route Login----------------------------//
//bccrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;

//session
var session=require('express-session');
app.use(session({ 
    secret: 'aaaaaaaaa', 
    cookie: { maxAge:4000000000 },//milisecond 10giay
    resave:true,
    saveUninitialized:true
}));
app.get("/login_admin",(req,res)=>{
    res.render("Login",{
        message1:""
    })
    
});
app.post("/login_admin",async (req,res)=>{
    let list = [];
    let observer = db.collection('Admin').where('Email','=',req.body.email).get()
       .then(snapshot => {
           snapshot.forEach(doc => {
          
              list.push(doc.data())
           });  
        
           list.forEach((arr)=>{

            bcrypt.compare(req.body.pass,arr.Passwords, function(err, result) {
                if(result==true){
                   req.session.email=req.body.email;
                    req.session.pass=req.body.pass;
                    req.session.image=arr.url;
                    req.session.username=arr.AcFullName
                    // res.redirect('/listproduct',{
                    //     username: req.session.username,
                    //     url:  req.session.image

                    // })
                    res.render("Home",{
                        pages:"Product_List",
                        username: req.session.username,
                        url:  req.session.image

                    })

                }else{
                    res.render("Login",{
                        message1:"Email Hoặc Mật Khẩu Không Hợp Lệ"
                    })
                }
            
        });
    })  
})

})
app.get("/logout",(req,res)=>{
   
    console.log("logout thành công")
    req.session.destroy();
    res.redirect("/login_admin")


})
//-----------------------------//Route Login//----------------------------//

//-----------------------------Route Main:Home----------------------------//
app.get("/", (req, res) => {
    if(req.session.email&&req.session.pass){

    res.render("Home", {    
        pages: "Product_List",
        username: req.session.username,
        url:  req.session.image
    });
}else{
    res.redirect("/login_admin")
}
})
//code generate id
const fs = require('fs')

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

require("./Controller/User_AdminController")(app,makeid,db,bcrypt,saltRounds,multer,moment,fs,Upload)         
require("./Controller/UserController")(app,makeid,db,bcrypt,saltRounds,multer,moment,fs,Upload)         
require("./Controller/CategoryController")(app,makeid,db,multer,moment,fs,Upload)         
require("./Controller/ProductController")(app,makeid,db,multer,moment,fs,Upload)         
require("./Controller/FeedbackController")(app,makeid,db,moment)     
require("./Controller/ReceiptController")(app, makeid, db, multer, moment, fs, Upload) 
require("./Controller/ChartController")(app,makeid,db,moment)  



















