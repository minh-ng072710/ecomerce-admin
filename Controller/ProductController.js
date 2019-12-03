module.exports=function(app,makeid,db,multer,moment,fs,Upload){
    //listproduct
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
    //addproduct
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
                    // let date_ob = (new Date(ts)).toString();
                    // let date = moment(date_ob).format("YYYY-MM-DD HH:MM:SS")
                               
                    
                    let docRef = db.collection('Product').doc(id+"_"+req.body.name).set({
        
                        catID:req.body.category,
                        description:req.body.description,
                        discount:0,
                        endSale:'',
                        imgURL:"https://nguyengiaminh.herokuapp.com/Upload/"+req.file.filename,
                        isSale:0,
                        name:req.body.name,
                        price:parseInt(req.body.price),
                        proID:id+"_"+req.body.name,
                        quantity: parseInt(req.body.quantity),
                        startSale:'',
                        volumetric:parseInt(req.body.volumtric),
                        date:ts
                        
                        
        
        
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
        // let date_ob = (new Date(ts)).toString();
        // let date = moment(date_ob).format("YYYY-MM-DD HH:MM:DD")
                
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
                    date:ts
                      
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
                    date:ts
                      
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
}