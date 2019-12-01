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
//-----------------------------Route 1:USER_ADMIN----------------------------//
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
app.get("/test4",(req,res)=>{
    var countDownDate1=new Date("2019-11-28").getTime();
    console.log(countDownDate1)
    var now = new Date().getTime();
    console.log(now)
})
app.get("/listadmin", (req, res, next) => {
    if(req.session.email&&req.session.pass){
         var list=[];
        res.render("Home", {
            pages: "Admin_List",
            list:list,
            username: req.session.username,
            url:  req.session.image
            
         })
        }else{
            
         res.redirect("./login_admin")    
        }
            
    });
app.get("/adduser_admin", (req, res) => {
    if(req.session.email&&req.session.pass){
    res.render("Home", {
        pages: "Add_User_Admin",
        username: req.session.username,
        url:  req.session.image
    })
}else{
    res.redirect("/login_admin")    
}


});
app.post("/adduser_admin", function (req, res) {

    if(req.session.email&&req.session.pass){
    var id = makeid(20);
    Upload(req, res, (err) => { 
        bcrypt.hash(req.body.password,saltRounds,(err,hash)=>{
            if(err){
                console.log(err);
            }else{
               
                        console.log("Upload is okay");
                        let ts = Date.now();
                        let date_ob = (new Date(ts)).toString();
                        let date = moment(date_ob).format("YYYY-MM-DD hh:mm:ss")
            
                        let docRef = db.collection('Admin').doc(id).set({
            
            
                            AcFullName: req.body.username,
                            Address: req.body.address,
                            Passwords: hash,
                            Gender: req.body.gender,
                            Email: req.body.email,
                            Phone: req.body.txtEmpPhone,
                            Time: date,
                            url:"https://nguyengiaminh.herokuapp.com/Upload/"+req.file.filename,
                            id: id,
            
            
                        });
            
                        res.redirect("./listadmin")
                    }
    
                });
               
            })
        }else{
            res.redirect("/login_admin")    
        }
    });        
            
           
        
         
app.get("/edituser_admin", (req, res) => {
    if(req.session.email&&req.session.pass){
            let list = [];
            var db1 = db.collection('Admin').where('id', '=', req.query.id).get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        // console.log(doc.id, '=>', doc.data());
                        return list.push(doc.data())
                        // console.log(list)
                    });
                    res.render("Home", {
                        pages: "Edit_User_Admin",
                        username: req.session.username,
                        url:  req.session.image,
                        listuser:list
                
                    });
        
                });
            }else{
                res.redirect("/login_admin")    
            }
            
        
        
});
        
            
 app.post("/edituser_admin/:id", (req, res) => {
    if(req.session.email&&req.session.pass){
        Upload(req, res, (err) => { 
            bcrypt.hash(req.body.pass,saltRounds,(err,hash)=>{
                if (err instanceof multer.MulterError) {
                    console.log("A Multer error occurred when uploading."); 
                  } else if (err) {
                      console.log("An unknown error occurred when uploading." + err);
                  }else{
                    let oldimage=req.body.oldimage;
                    let oldpass=req.body.oldpass;
                    if( typeof req.file !== undefined && req.file){
                        console.log("Upload is okay");
                        let ts = Date.now();
                        let date_ob = (new Date(ts)).toString();
                        let date = moment(date_ob).format("YYYY-MM-DD hh:mm:ss")
             
                        let cityRef = db.collection('Admin').doc(req.params.id);
                        if(oldpass==req.body.pass){
                            let updateMany = cityRef.update({
            
            
                                AcFullName: req.body.username,
                                Address: req.body.address,
                                Passwords: oldpass,
                                Gender: req.body.gender,
                                Email: req.body.email,
                                Phone: req.body.txtEmpPhone,
                                Time: date,
                                url:"https://nguyengiaminh.herokuapp.com/Upload/"+req.file.filename,
                           
                
                            });
                        }else{
                            let updateMany = cityRef.update({
            
            
                                AcFullName: req.body.username,
                                Address: req.body.address,
                                Passwords: hash,
                                Gender: req.body.gender,
                                Email: req.body.email,
                                Phone: req.body.txtEmpPhone,
                                Time: date,
                                url:"https://nguyengiaminh.herokuapp.com/Upload/"+req.file.filename,
                           
                
                            });
                        }
                      
            
                        res.redirect("/listadmin")
                    }else{
                        console.log("Upload is okay");
                        let ts = Date.now();
                        let date_ob = (new Date(ts)).toString();
                        let date = moment(date_ob).format("YYYY-MM-DD hh:mm:ss")
             
                        let cityRef = db.collection('Admin').doc(req.params.id);
                        if(oldpass==req.body.pass){
                            let updateMany = cityRef.update({
            
            
                                AcFullName: req.body.username,
                                Address: req.body.address,
                                Passwords: oldpass,
                                Gender: req.body.gender,
                                Email: req.body.email,
                                Phone: req.body.txtEmpPhone,
                                Time: date,
                                url:oldimage,
                           
                
                            });
                        }else{
                            let updateMany = cityRef.update({
            
            
                                AcFullName: req.body.username,
                                Address: req.body.address,
                                Passwords: hash,
                                Gender: req.body.gender,
                                Email: req.body.email,
                                Phone: req.body.txtEmpPhone,
                                Time: date,
                                url: oldimage,
                           
                
                            });
                        }
            
                        res.redirect("/listadmin")
                
                      }
                        }
                
                            });
                           
                        })
    }else{
        res.redirect("/login_admin")    
    }
                     
            });                 
app.get("/deleteuser_admin", (req, res) => {
    if(req.session.email&&req.session.pass){
    if(req.query.url!=""){
        const path = 'Public/Upload/' + req.query.url;
        try {
            if (fs.existsSync(path)) {
                fs.unlinkSync(path);
                var db1 = db.collection('Admin').doc(req.query.id).delete();
            }else{
              
                var db1 = db.collection('Admin').doc(req.query.id).delete();
    
            }
          } catch(err) {
            console.error(err)
          }
        res.redirect("/listadmin")
    }else if(req.query.url==null){
        var db1 = db.collection('Admin').doc(req.query.id).delete();
    }
}else{
    res.redirect("/login_admin")
}
  
})            
//-----------------------------Route 2:USER----------------------------//

app.get("/adduser", (req, res) => {
    if(req.session.email&&req.session.pass){
    res.render("Home", {
        pages: "Add_User",
        username: req.session.username,
        url:  req.session.image
    })
}else{
    res.redirect("/login_admin")
}

});
app.post("/adduser", function (req, res) {
    if(req.session.email&&req.session.pass){
                  var id = makeid(20);
                    console.log("Upload is okay");
                    let ts = Date.now();
                    let date_ob = (new Date(ts)).toString();
                    let date = moment(date_ob).format("DD/MM/YY  hh:mm")
        
                    let docRef = db.collection('User').doc(id).set({
        
        
                        accFullName: req.body.username,
                        email: req.body.email,
                        gender: req.body.gender,
                        location: req.body.address,
                        password: req.body.password,
                        phone: req.body.txtEmpPhone,
                        signupdate: date,
                        userID: id,
                    });
        
                    res.redirect("./listuser")
                }else{
                    res.redirect("/login_admin")
                }
        
                });
        
        
           
     
      
app.get("/edituser", (req, res) => {
    if(req.session.email&&req.session.pass){
    let list = [];
    var db1 = db.collection('User').where('userID', '=', req.query.id).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                // console.log(doc.id, '=>', doc.data());
                return list.push(doc.data())
                // console.log(list)
            });
            res.render("Home", {
                pages: "Edit_User",
                listuser:list,
                username: req.session.username,
                url:  req.session.image
        
            });

        });
    }else{
        res.redirect("/login_admin")
    }


});
app.post("/edituser/:id", (req, res) => {
 
    if(req.session.email&&req.session.pass){
    let ts = Date.now();
    let date_ob = (new Date(ts)).toString();
    let date = moment(date_ob).format("DD/MM/YY hh:mm:ss")
    let cityRef = db.collection('User').doc(req.params.id);
    
    let updateMany = cityRef.update({
    accFullName: req.body.username,
    email: req.body.email,
    gender: req.body.gender,
    location: req.body.address,
    password: req.body.pass,
    phone: req.body.txtEmpPhone,
    signupdate: date,

    })
    
    res.redirect("/listuser")
}else{
    res.redirect("/login_admin")
}
    });    
    
 
      
             
    

app.get("/listuser", (req, res, next) => {
    if(req.session.email&&req.session.pass){
    let list = [];
     try{
    let observer = db.collection('User').get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                list.push(doc.data())
            });
          
            return res.render("Home", {
                pages: "User_List",
                username: req.session.username,
                url:  req.session.image,
                list: list,
                
            }
            );
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });

      
    }catch (err){
        console.log(err)
    }
}else{
    res.redirect("/login_admin")
}
})    
            
          
            

app.get("/delete_user", (req, res) => {
    if(req.session.email&&req.session.pass){
    var db1 = db.collection('User').doc(req.query.id).delete();
    res.redirect("/listuser")
    }else{
        res.redirect("/login_admin")
    }
})      
     
//-----------------------------//Route 2:USER//----------------------------//    

//-----------------------------//Route 3:GROUP_PRODUCT//----------------------------//
app.get("/listcats",(req,res)=>{
    if(req.session.email&&req.session.pass){
    let list = [];
    let observer = db.collection('Catgories').get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                list.push(doc.data())
            });
          
            return res.render("Home", {
                pages: "Categories_List",
                username: req.session.username,
                url:  req.session.image,
                list: list,
                
            }
            
            );
        }) 
    }else{
        res.redirect("/login_admin")
    }
    }); 
app.get("/addcats", (req, res) => {
    if(req.session.email&&req.session.pass){
    res.render("Home", {
        pages: "Add_Group_Product",
        username: req.session.username,
        url:  req.session.image
    })
}else{
    
   res.redirect("/login_admin")
}
});
app.post("/addcats", function (req, res) {
    if(req.session.email&&req.session.pass){
            Upload(req, res, (err) => {
                if (err instanceof multer.MulterError) {
                    console.log("A Multer error occurred when uploading."); 
                }else if (err) {
                    console.log("An unknown error occurred when uploading." + err);
                  }else{
                    console.log("Upload is okay");
                    let ts = Date.now();
                    let date_ob = (new Date(ts)).toString();
                    let date = moment(date_ob).format("YYYY-MM-DD  hh:mm:ss")
        
                    let docRef = db.collection('Category').doc(req.body.name_en).set({
        
                        catID:req.body.name_en,
                        imgURL:"http://nguyengiaminh.herokuapp.com/Upload/"+req.file.filename,
                        name:req.body.name_vi,
                      
                        time:date,
        
        
                    });
        
                    res.redirect("./listcats")
        
                }
            });
        }else{
            res.redirect("/login_admin")
        }
        })
app.get("/editcats", (req, res) => {
    if(req.session.email&&req.session.pass){
        let list = [];
        var db1 = db.collection('Category').where('catID', '=', req.query.id).get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                
                    return list.push(doc.data())
                
                });
                res.render("Home", {
                    pages:"Edit_Cats",
                    listcats:list,  username: req.session.username,
                    url:  req.session.image
            
                });
    
            });
        }else{
            res.redirect("/login_admin")
        }
    
    
    });    
         
app.post("/editcats/:id", (req, res) => {
    if(req.session.email&&req.session.pass){
      Upload(req,res,(err)=>{
        if (err instanceof multer.MulterError) {
            console.log("A Multer error occurred when uploading."); 
          } else if (err) {
              console.log("An unknown error occurred when uploading." + err);
          }else{
            let oldimage=req.body.oldimage
            if( typeof req.file !== undefined && req.file)
            {
              console.log("Upload is okay");
               let ts = Date.now();

                let date_ob = (new Date(ts)).toString();
                let date = moment(date_ob).format("YYYY-MM-DD  hh:mm:ss")
                let cityRef = db.collection('Category').doc(req.params.id);
                    
                let updateMany = cityRef.update({
           
     
                    imgURL:"http://nguyengiaminh.herokuapp.com/Upload/"+req.file.filename, 
                    name:req.body.name_vi,
                
                    
                    Time:date,
                    
                
                });
              
             res.redirect("/listcats")
            }else{
                
                let ts = Date.now();
 
                 let date_ob = (new Date(ts)).toString();
                 let date = moment(date_ob).format("YYYY-MM-DD  hh:mm:ss")
                 let cityRef = db.collection('Category').doc(req.params.id);
                     
                 let updateMany = cityRef.update({
            
      
                     imgURL:oldimage,
                     name:req.body.name_vi,
                 
                     
                     Time:date,
                     
                 
                 });
               
            res.redirect("/listcats")
            }
    }
    })
}else{
    res.redirect("/login_admin")
}
        });
app.get("/deletecats", (req, res) => {
    if(req.session.email&&req.session.pass){
    if(req.query.url!=""){
        const path = 'Public/Upload/' + req.query.url;
        try {
            if (fs.existsSync(path)) {
                fs.unlinkSync(path);
                var db1 = db.collection('Category').doc(req.query.id).delete();
            }else{
              
                var db1 = db.collection('Category').doc(req.query.id).delete();
    
            }
          } catch(err) {
            console.error("Lỗi: "+err)
          }
        res.redirect("/listcats")
    }
}else{
    res.redirect("/login_admin")
}
  
})    
// /*--check trung san pham---*/
// app.post("/addcats", (req, res) => {
//     var list=[];
// Upload(req,res,(err)=>{
//     let query = db.collection('Catgories')
//     .get()
//     .then(snapshot => {
//       snapshot.forEach(doc => {
//         // console.log(doc.id, '=>', doc.data());
//         list.push(doc.data())
//       });
//       list.forEach((arr)=>{
         
//         if(arr.catID!=req.body.name_en||arr.name!=req.body.name_vi){
//             var id=makeid(20)
//             Upload(req, res, (err) => {
            
//                 console.log(req.body.name_en)
//                 let ts = Date.now();
//                 let date_ob = (new Date(ts)).toString();
//                 let date = moment(date_ob).format("DD/MM/YY  hh:mm")
    
//                 let docRef = db.collection('Catgories').doc(req.body.name_en).set({
    
    
//                    catID:req.body.name_en,
//                    imgURL:req.file.filename,
//                    name:req.body.name_vi,
//                    quantity:req.body.quantity,
//                    id:id,
//                    Time:date,
    
    
//                 });
    
//                 res.redirect("./listcats")
//             })
         
    
//         }else{
//             console.log("trung ten roi")
//             res.end();
        
//         }
         
//     })
// })

// })
// })
/*--check trung san pham---*/
//-----------------------------//Route 3:GROUP_PRODUCT//----------------------------//



//-----------------------------Route 4:PRODUCT----------------------------//

app.get("/listproduct",(req,res)=>{
    let ts = Date.now();
    let date_ob = (new Date(ts)).toString();
    let date = moment(date_ob).format("YYYY-MM-DD 00:00:00")
    console.log(date)

    if(req.session.email&&req.session.pass){
    let list = [];
    let observer = db.collection('Product').get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                list.push(doc.data())
            });

      
            return res.render("Home", {
                pages: "Product_List",
                username: req.session.username,
                url:  req.session.image,
                list: list,
                
            });
              
        })
    }else{
        res.redirect("/login_admin")
    }
})
app.get("/addproduct",(req,res)=>{
    if(req.session.email&&req.session.pass){
        let list=[];
        let cats =db.collection("Category").get().then((snapshot)=>{
            snapshot.forEach((arr)=>{
               list.push(arr.data())
            })
            res.render("Home",{
                pages:"Add_Product",
                username: req.session.username,
                url:  req.session.image,
                listcats:list
            })
    
        })
    }else{
        
     res.redirect("/login_admin")
    }
   
}) 
app.post("/flashsale",(req,res)=>{
    
                let tsstart = req.body.startsale;
                let date_ob_start = (new Date(tsstart)).toISOString();
                let datestart = moment(date_ob_start).format("YYYY-MM-DD HH:MM:SS");

                let oldstart=req.body.startsale_old;
                let tssend=req.body.endsale;
                let date_ob_end = (new Date(tssend)).toISOString();
                let dateend = moment(date_ob_end).format("YYYY-MM-DD HH:MM:SS");

                let oldend=req.body.endsale_old;
               
                    let cityRef = db.collection('Product').doc(req.query.id);
                    let updateMany = cityRef.update({
           
            
                        discount:parseInt(req.body.discount_percent),
                        endSale:dateend,
                        startSale:datestart,
                      
                   
                })

                
                // let date_ob_start = (new Date(tsstart)).toISOString();
                // let datestart = moment(date_ob_start).format("YYYY-MM-DD HH:MM:SS");
                
                // console.log("ddd:"+datestart)
                // let tssend=req.body.endsale;
                // let date_ob_end=(new Date(tssend)).toISOString();
                // let dateend = moment(date_ob_end).format("YYYY-MM-DD HH:MM:SS");
                // console.log("ddd:"+dateend)

  
        res.redirect("/listproduct")
    })
    
app.post("/deletesale/:id",(req,res)=>{
    let cityRef = db.collection('Product').doc(req.params.id);
    
    let updateMany = cityRef.update({
       
        
        discount:0,
        endSale:'',
        startSale:'',
        isSale:0,
      
    });
    res.redirect("/listproduct")
})
app.post("/addproduct",(req,res)=>{
    if(req.session.email&&req.session.pass){
    var id=makeid(20)
    
    
        Upload(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                console.log("A Multer error occurred when uploading."); 
            }else if (err) {
                console.log("An unknown error occurred when uploading." + err);
              }else{
                console.log("Upload is okay");
    
                let ts = Date.now();
                let date_ob = (new Date(ts)).toString();
                let date = moment(date_ob).format("YYYY-MM-DD HH:MM:SS")
                           
                
                
                let docRef = db.collection('Product').doc(id).set({
    
                    catID:req.body.category,
                    description:req.body.description,
                    discount:0,
                    endSale:'',
                    imgURL:"https://nguyengiaminh.herokuapp.com/Upload/"+req.file.filename,
                    isSale:0,
                    name:req.body.name,
                    price:parseInt(req.body.price),
                    proID:id,
                    quantity: parseInt(req.body.quantity),
                    startSale:'',
                    volumetric:parseInt(req.body.volumtric),
                    date:date
                    
                    
    
    
                });
    
    
                res.redirect("./listproduct")
    
            }
        });
    
   
}else{
    res.redirect("/login_admin")
}
});

app.get("/editproduct", (req, res) => {

    // let  tssend;
    let datestart;
    let hourstart;
    let fulldatestart
    let dateend;
    let hourend;
    let fulldateend;
    let list;
    let list1=[];//cái này  nè anh vô là mỗi lần request nó hay bioj rỗng phải req lại nó mới có giá trị

    
// loi bat dong bo vh   có cách nào k anh 
if(req.session.email&&req.session.pass){
        let cats =db.collection("Category").get().then((snapshot)=>{
            snapshot.forEach((arr)=>{
               list1.push(arr.data())
            })
            var db1 = db.collection('Product').where('proID','=',req.query.id).get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                
                   list=doc.data()
                //    console.log(list)
                console.log(list.endSale)
                // var date = new Date(list.endSale); // some mock date
                //  milliseconds = date.getTime();\
    
                tsstart=list.startSale
              
                let date_ob_start = (new Date(tsstart)).toISOString();
                datestart = moment(date_ob_start).format("YYYY-MM-DD");
                hourstart= moment(date_ob_start).format("HH:MM:SS");
                
                tsend=list.endSale
                let date_ob_end=(new Date(tsend)).toISOString();
                dateend = moment(date_ob_end).format("YYYY-MM-DD");
                hourend= moment(date_ob_end).format("HH:MM:SS"); 
    
                });
             
                res.render("Home", {
                    pages: "Edit_Product",
                    username: req.session.username,
                    url:  req.session.image,
                    listcats:list,
                    listcats1:list1,
                    time_start:datestart,
                    hour_start:hourstart,
                    full_timestart: tsstart,
                    time_end:dateend,
                    hour_end:hourend,
                    full_timeend: tsend,
                });
    
            });
    
        })
    
}else{
    res.redirect("/login_admin")
}


});   
app.get("/editproduct1", (req, res) => {
    // let  tssend;
    let datestart;
    let hourstart;
    let fulldatestart
    let dateend;
    let hourend;
    let fulldateend;
    let list;
    let list1=[];
    
    if(req.session.email&&req.session.pass){

        let cats =db.collection("Category").get().then((snapshot)=>{
            snapshot.forEach((arr)=>{
               list1.push(arr.data())
            })
            var db1 = db.collection('Product').where('proID','=',req.query.id).get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                
                   list=doc.data()
                //    console.log(list)
                console.log(list.endSale)
                // var date = new Date(list.endSale); // some mock date
                //  milliseconds = date.getTime();\
    
                tsstart=list.startSale
              
                let date_ob_start = (new Date(tsstart)).toISOString();
                datestart = moment(date_ob_start).format("YYYY-MM-DD");
                hourstart= moment(date_ob_start).format("HH:MM:SS");
                
                tsend=list.endSale
                let date_ob_end=(new Date(tsend)).toISOString();
                dateend = moment(date_ob_end).format("YYYY-MM-DD");
                hourend= moment(date_ob_end).format("HH:MM:SS"); 
    
                });
                console.log(list1)
            
                res.render("Home", {
                    pages: "Edit_Product",
                    username: req.session.username,
                    url:  req.session.image,
                    listcats:list,
                    listcats1:list1,
                    time_start:datestart,
                    hour_start:hourstart,
                    full_timestart: tsstart,
                    time_end:dateend,
                    hour_end:hourend,
                    full_timeend: tsend,
                });
    
            });
    
        })
  
    }else{
        res.redirect("/login_admin")
    }


}); 
app.get("/editproduct2", (req, res) => {
    // let  tssend;
    let datesend ;
    let list;
    let list1=[];
    
    if(req.session.email&&req.session.pass){

        let cats =db.collection("Category").get().then((snapshot)=>{
            snapshot.forEach((arr)=>{
               list1.push(arr.data())
            })
            var db1 = db.collection('Product').where('proID','=',req.query.id).get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                
                   list=doc.data()
               
                });
            
                res.render("Home", {
                    pages: "Edit_Product2",
                    username: req.session.username,
                    url:  req.session.image,
                    listcats:list,
                    listcats1:list1,
                 
                });
    
            });
    
        })
  
    }else{
        res.redirect("/login_admin")
    }


}); 
app.post("/editproduct/:id", (req, res) => {
    let ts = Date.now();
    let date_ob = (new Date(ts)).toString();
    let date = moment(date_ob).format("YYYY-MM-DD HH:MM:DD")
            
    if(req.session.email&&req.session.pass){
    Upload(req,res,(err)=>{
      if (err instanceof multer.MulterError) {
          console.log("A Multer error occurred when uploading."); 
        } else if (err) {
            console.log("An unknown error occurred when uploading." + err);
        }else{
            let oldimage=req.body.oldimage
            if( typeof req.file !== undefined && req.file)
            {
                let cityRef = db.collection('Product').doc(req.params.id);
            
                let updateMany = cityRef.update({
                   
             
                catID:req.body.category,
                description:req.body.description,
                imgURL:"https://nguyengiaminh.herokuapp.com/Upload/"+req.file.filename,
                name:req.body.name,
                price:parseInt(req.body.price),
              
                quantity: parseInt(req.body.quantity),
                volumetric:parseInt(req.body.volumtric),
                date:date
                  
                });
            
            }else{
                let cityRef = db.collection('Product').doc(req.params.id);
            
                let updateMany = cityRef.update({
                   
             
                catID:req.body.category,
                description:req.body.description,
             
              
                imgURL:oldimage,
             
                name:req.body.name,
                price:parseInt(req.body.price),
               
                quantity: parseInt(req.body.quantity),
          
                volumetric:parseInt(req.body.volumtric),
                date:date   
                  
                });
            }
            res.redirect("/listproduct")
        }
    }) 
}else{
    res.redirect("/login_admin")
}
      });

  

app.get("/deleteproduct", (req, res) => {
    if(req.session.email&&req.session.pass){
  if(req.query.url!=""){
      const path = 'Public/Upload/' + req.query.url;
      try {
          if (fs.existsSync(path)) {
              fs.unlinkSync(path);
              var db1 = db.collection('Product').doc(req.query.id).delete();
          }else{
            
              var db1 = db.collection('Product').doc(req.query.id).delete();
  
          }
        } catch(err) {
          console.error(err)
        }
      res.redirect("/listproduct")
  }
}else{
    res.redirect("/login_admin")
}

})    
//-----------------------------//Route 4:PRODUCT//----------------------------//
       


//-----------------------------Route 5:LIST FEEDBACK----------------------------//
app.get("/listfeedback",(req,res)=>{

    if(req.session.email&&req.session.pass){
        let list = [];
        let observer = db.collection('Feedback').get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    list.push(doc.data())
                });
          
                return res.render("Home", {
                    pages: "Feedback_List",
                    username: req.session.username,
                    url:  req.session.image,
                    list: list,
                    
                });
            })
    }else{
        res.redirect("/login_admin")
    }
  
});
app.get("/addfeedback",(req,res)=>{
    if(req.session.email&&req.session.pass){
    let list = [];
    
    let observer = db.collection('Product').get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                list.push(doc.data())
            });
      
            res.render("Home",{
                pages:"Add_FeedBack",
                username: req.session.username,
                url:  req.session.image,
                listfeedback:list
            })
    
              
        })
    }else{
        res.redirect("/login_admin")
    }
     
   
}) 
app.post("/addfeedback",(req,res)=>{
    if(req.session.email&&req.session.pass){
            id=makeid(20)
            let ts = Date.now();
            let date_ob = (new Date(ts)).toString();
            let date = moment(date_ob).format("YYYY-MM-DD  hh:mm:ss")

            
            

            let docRef = db.collection('Feedback').doc(id+'pro'+req.body.nameproduct).set({

                content:req.body.content,
                date:date,
                email:req.body.email,
                proID:parseInt(req.body.nameproduct),
                fbID:id+'pro'+req.body.nameproduct
            });
            res.redirect("./listfeedback")

        
        }else{
            res.redirect("/login_admin")
        
        }
        });  
    

app.get("/editfeedback", (req, res) => {
    if(req.session.email&&req.session.pass){
    let list =[];
    let list2=[];
    let list3=[];
    var db1 = db.collection('Feedback').where('fbID','=',req.query.id).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
            
                return list.push(doc.data())
            
            });
            console.log(list)
            var db2=db.collection('Product').get()
            .then((snapshot)=>{
                snapshot.forEach((doc)=>{
                    list3.push(doc.data());
              
                })
                
            })
            list.forEach((item)=>{
                var db2=db.collection('Product').where('proID','=',''+item.proID).get()
                .then((snapshot)=>{
                    snapshot.forEach((doc)=>{
                        list2.push(doc.data())
                    })
                    console.log(list2)
                    res.render("Home", {
                        pages: "Edit_Feedback",
                        username: req.session.username,
                        url:  req.session.image,
                        listfeedback:list,
                        listproduct:list2,
                        list3:list3
        
                
                    });
                })
                
            })
           
          

        });
    }else{
        res.redirect("/login_admin")
    }


});   
app.post("/editfeedback/:id", (req, res) => {
    if(req.session.email&&req.session.pass){
    id=makeid(20)
    let ts = Date.now();
    let date_ob = (new Date(ts)).toString();
    let date = moment(date_ob).format("YYYY-MM-DD  hh:mm:ss")

    
    

    let docRef = db.collection('Feedback').doc(req.params.id)
    let updateMany=docRef.update({

    
        content:req.body.content,
        date:date,
        email:req.body.email,
        proID:parseInt(req.body.nameedit),
        fbID:req.params.id
    });
    res.redirect("/listfeedback")
}else{
    res.redirect("/login_admin")
}
  })
     
app.get("/deletefeedback", (req, res) => {

    if(req.session.email&&req.session.pass){
    var db1 = db.collection('Feedback').doc(req.query.id).delete();
       
      res.redirect("/listfeedback")
    }else{
        res.redirect("/login_admin")
    }
  

})   
//-----------------------------//Route 5:LIST FEEDBACK//----------------------------//




//-----------------------------Route 6:LIST  ORDER----------------------------//
app.get("/listorder",(req,res)=>{
    let list = [];
    let observer = db.collection('Order').get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                list.push(doc.data())
            });
            console.log(list)
    
            return res.render("Home", {
                pages: "Order_List",
                username: req.session.username,
                url:  req.session.image,
                list: list,
                
            });
        })
});
app.get("/addfeedback",(req,res)=>{
    let list = [];
    
    let observer = db.collection('Product').get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                list.push(doc.data())
            });
      
            res.render("Home",{
                pages:"Add_FeedBack",
                listfeedback:list
            })
    
              
        })
     
   
}) 
app.post("/addfeedback",(req,res)=>{
            id=makeid(20)
            let ts = Date.now();
            let date_ob = (new Date(ts)).toString();
            let date = moment(date_ob).format("YYYY-MM-DD  hh:mm:ss")

            
            

            let docRef = db.collection('Feedback').doc(id+'pro'+req.body.nameproduct).set({

                content:req.body.content,
                date:date,
                email:req.body.email,
                proID:parseInt(req.body.nameproduct),
                _id_feedback:id+'pro'+req.body.nameproduct
            });
            res.redirect("./listfeedback")

        
  
        });  
    

app.get("/editfeedback", (req, res) => {
    let list =[];
    let list2=[];
    let list3=[];
    var db1 = db.collection('Feedback').where('fbID','=',''+req.query.id).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
            
                return list.push(doc.data())
            
            });
            console.log(list)
            var db2=db.collection('Product').get()
            .then((snapshot)=>{
                snapshot.forEach((doc)=>{
                    list3.push(doc.data());
              
                })
                
            })
            list.forEach((item)=>{
                var db2=db.collection('Product').where('proID','=',''+item.proID).get()
                .then((snapshot)=>{
                    snapshot.forEach((doc)=>{
                        list2.push(doc.data())
                    })
                    console.log(list2)
                    res.render("Home", {
                        pages: "Edit_Feedback",
                        listfeedback:list,
                        listproduct:list2,
                        list3:list3
        
                
                    });
                })
                
            })
           
          

        });


});   
app.post("/editfeedback/:id", (req, res) => {
    id=makeid(20)
    let ts = Date.now();
    let date_ob = (new Date(ts)).toString();
    let date = moment(date_ob).format("YYYY-MM-DD  hh:mm:ss")

    
    

    let docRef = db.collection('Feedback').doc(req.params.id)
    let updateMany=docRef.update({

    
        content:req.body.content,
        date:date,
        email:req.body.email,
        proID:parseInt(req.body.nameedit),
        _id_feedback:req.params.id
    });
    res.redirect("/listfeedback")
  })
     
app.get("/deletefeedback", (req, res) => {

  
              var db1 = db.collection('Feedback').doc(req.query.id).delete();
       
      res.redirect("/listfeedback")
  

}) 


//-----------------------------//Route 6:LIST ORDER//----------------------------//
app.get("/chart",(req,res)=>{
    res.render("Home",{
        pages:"statistical",
        username: req.session.username,
        url:  req.session.image,
    })
})















