//express
var express = require("express");
var app = express();
app.set("view engine", "ejs");
app.set("views", "./Views");
app.use(express.static("Public"));
var moment=require('moment')

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
        console.log(file);
        var a = file.mimetype.split('/');
        var b = a[0];
        if (b == "image") {
            cb(null, true);
        } else {
            return cb(new Error("Only upload Image!!!!!!"));
        }
    }
}).single("image");

//express-session
var session = require('express-session');
app.use(session({ 
    secret: 'aaaaaaaaa', 
    cookie: { maxAge: 60*60 },//milisecond 10giay
    resave:true,
    saveUninitialized:true
}));
// var user=require("./Model/User");
// app.get("/test",(req,res)=>{
//     res.render("test");
// })
// app.post("/addtest",(req,res)=>{
//    var us1=new user({
//        firstname:req.body.firstname,
//        lastname:req.body.lastname
//    });
//    console.log(us1);
// })
//multer-drive
const { google } = require('googleapis');
   
    const multerDrive = require('multer-drive');
    const auth = new google.auth.JWT({
        email: 'minh072710@gmail.com',
        key: 'Minh99824@',
        scopes: ['https://www.googleapis.com/auth/drive'],
    });
    const upload = multer({
        storage: multerDrive(auth),
        // Rest of multer's options
    });

 
    app.post('/upload', upload.single('file'), (req, res) => {
        if(!req.file) {
            return res.status(500).send('An error occurred while uploading your file');
        }
        res.status(200).send('Hurray! File was uploaded.');
    });
 
//-----------------------------Connect FireStore----------------------------//
const admin = require('firebase-admin');

let serviceAccount = require('./sdk.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();
const util = require('util');
console.log(util.inspect('index.js', { showHidden: false, depth: null }));

//-----------------------------Port Option----------------------------//
var port = 3000;
app.listen(port, function () {
    console.log("App is running on Port: " + port);
});

//-----------------------------Route Main:Home----------------------------//
app.get("/home",(req,res)=>{
    res.render("Home",{
        pages:"Home"
    });
})

//-----------------------------Route 1:USER----------------------------//
app.get("/addgroupuser",(req,res)=>{
    res.render("Home",{
        pages:"Add_Group_User",
    })
});
app.post("/addgroupuser",(req,res)=>{
    var id=makeid(20);
    let group_user = db.collection('GroupUsers').doc(id);

    let groupuser = group_user.set({
    Name:req.body.name,
    IdGroup:id,
    IdKids:[],

    });
//cssds
    // let list = [];
 
    // var db1 = db.collection('Tesst').get()
    //     .then((snapshot) => {
    //         snapshot.forEach((doc) => {
    //             console.log(doc.id, '=>', doc.data());
    //             list.push(doc.data());
    //         });
});

app.get("/listgroupuser",(req,res)=>{
    res.render("Home",{
        pages:"Admin_Group_List"
    })
});
app.get("/adduser/",(req,res)=>{
    res.render("Home",{
        pages:"Add_User"
    })

});

//code generate id
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
var jwt = require('jsonwebtoken');
var secret="aaaaaaaaa";

app.post("/adduser", function (req, res) {
    var id=makeid(20);
    
    Upload(req, res, (err) => {
        if (err) {
            console.log("insert error: " + err);
        } else {
         
            let ts =Date.now();
            let date_ob=(new Date(ts)).toString();
            let date=moment(date_ob).format("DD/MM/YY  hh:mm")

            let docRef = db.collection('Admin').doc(id).set({


                AcFullName: req.body.username,
                Address: req.body.address,
                Passwords: req.body.password,
                Gender: req.body.gender,
                Email: req.body.email,
                Phone: req.body.txtEmpPhone,
                Time:date,
                url: req.file.filename,
                id: id,
                

            });
            
            res.redirect("./listuser")


        };


});
});

app.get("/listuser",(req,res)=>{
    let list = [];
    let observer = db.collection('Admin').onSnapshot(async querySnapshot => {
        querySnapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            console.log('New city: ', change.doc.data());
            list.push(change.doc.data());

        
          }
          if (change.type === 'modified') {
            console.log('Modified city: ', change.doc.data());
            return 1;
            
            
          }
          if (change.type === 'removed') {
            console.log('Removed city: ', change.doc.data());
            
          }
     
        });
        
        res.render("Home", {
            pages:"Admin_List",
           
            list: list,
        })
    
    })
});


app.get("/edituser",(req,res)=>{
    let list=[];
    var db1 = db.collection('Admin').where('id','=', req.query.id).get()
    .then((snapshot) => {
        snapshot.forEach((doc) => {
            // console.log(doc.id, '=>', doc.data());
           list.push(doc.data())
        //    console.log(list)
        });
        res.render("Home",{
            pages:"Edit_User",
            listuser:list
        });
        
    });
    
   
});
app.post("/edituser/:id",(req,res)=>{


    
  
    
        // [START update_document_many]
        let ts =Date.now();
        let date_ob=(new Date(ts)).toString();
        let date=moment(date_ob).format("DD/MM/YY  hh:mm")
        let cityRef = db.collection('Admin').doc(req.params.id);
       
        let updateMany = cityRef.update({
            AcFullName: req.body.username,
                Address: req.body.address,
                Passwords: req.body.password,
                Gender: req.body.gender,
                Email: req.body.email,
                Phone: req.body.txtEmpPhone,
                Time:date,
        });
            
        res.redirect("http://localhost:3000/listuser")
      
      
      });
app.get("/delete",(req,res)=>{
        var db1 = db.collection('Admin').doc(req.query.id).delete();
    
       res.redirect("http://localhost:3000/listuser")
  
    })
//-----------------------------//Route 2:PRODUCT//----------------------------//
app.get("/addgroupproduct",(req,res)=>{
    res.render("Home",{
        pages:"Add_Group_Product"
    })
});
app.post("/addgroupproduct",(req,res)=>{
    var id=makeid(20);

          
                let ts =Date.now();
                let date_ob=(new Date(ts)).toString();
                let date=moment(date_ob).format("DD/MM/YY  hh:mm");
                let docRef=db.collection("Categories").doc(req.body.name1).set({
                    catID:id,
                    img:req.body.downloadlink,
                    name:req.body.name,
            
                    time:date
                })
                
          
  

});

app.get("/test",(req,res)=>{
    res.render("Home",{
        pages:"Test"
    })
})



   
             


            
   
            













    
 
  













