module.exports=function(app,makeid,db,multer,moment,fs,Upload){
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
}