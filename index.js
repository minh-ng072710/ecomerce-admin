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
app.listen(process.env.PORT||3000)

//-----------------------------Route Main:Home----------------------------//
app.get("/",(req,res)=>{
    res.render("Home",{
        pages:"Home"
    });
})

//-----------------------------Route 1:USER----------------------------//
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
});
app.get("/listgroupuser",(req,res)=>{
    res.render("Home",{
        pages:"Admin_Group_List"
    })
});
app.get("/adduser",(req,res)=>{
    res.render("Home",{
        pages:"Add_User"
    })

});
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
    try{
        let observer = db.collection('Admin').onSnapshot(querySnapshot => {
            querySnapshot.docChanges().forEach(change => {
              if (change.type === 'added') {
                console.log('New city: ', change.doc.data());
                list.push(change.doc.data());
               
              }else if (change.type === 'modified') {
                console.log('Modified city: ', change.doc.data());
                list.push(change.doc.data());
               
              }else if (change.type === 'removed') {
                console.log('Removed city: ', change.doc.data());
                return list.push(change.doc.data());
              }
            });
            return res.render("Home", {
                pages:"Admin_List",
               
                list: list,
            })
        
        })
    }catch (err){
        console.log(err)
    }
});
app.get("/edituser",(req,res)=>{
    let list=[];
    var db1 = db.collection('Admin').where('id','=', req.query.id).get()
    .then((snapshot) => {
        snapshot.forEach((doc) => {
            // console.log(doc.id, '=>', doc.data());
           return list.push(doc.data())
        //    console.log(list)
        });
        res.render("Home",{
            pages:"Edit_User",
            listuser:list
        });
        
    });
    
   
});
app.post("/edituser/:id",(req,res)=>{
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
        
    res.redirect("http://bigprojecta.herokuapp.com/listuser")
  
  
  });
app.get("/delete",(req,res)=>{
    var db1 = db.collection('Admin').doc(req.query.id).delete();
   // You aren't doing anything with data so no need for the return value
upload(req,res,async (err)=>{
    if(err){
        console.log("eroor"+err);
    }else{
        await uploadToRemoteBucket(req.file.path)

        // Delete the file like normal
        await unlinkAsync(req.file.path)
    
        res.end("UPLOAD COMPLETED!")
    }
  
})
   res.redirect("http://bigprojecta.herokuapp.com/listuser")

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




         


        

        


    
  
    
        // [START update_document_many]
     












    
 
  













