const Category =require("../Model/Category")
module.exports=function(app,makeid,db,multer,moment,fs,Upload){
    app.get("/listcats",async (req,res)=>{
        if(req.session.email&&req.session.pass){

          let list=  await Category.CategoryModel.getAll()
                return res.render("Home", {
                    pages: "Categories_List",
                    username: req.session.username,
                    url:  req.session.image,
                    list: list,
                    
                }
                
                );
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
                     
                       
                        Category.CategoryModel.addCat(req.body.name_en,req.body.name_vi,req.file.filename)
                        res.redirect("./listcats")
            
                    }
                });
            }else{
                res.redirect("/login_admin")
            }
       
            })
    app.get("/editcats",async (req, res) => {
        if(req.session.email&&req.session.pass){

         let list =await Category.CategoryModel.editCat(req.query.id)
                
                    res.render("Home", {
                        pages:"Edit_Cats",
                        listcats:list,  
                        username: req.session.username,
                        url:  req.session.image
                
                    });
                }else{
                    res.redirect("/login_admin")
                }
           
        
        });    
             
    app.post("/editcats/:id",async (req, res) => {
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

                    Category.CategoryModel.editCat_Post_Image(req.params.id,req.file.filename,req.body.name_vi)
                    
                  
                    res.redirect("/listcats")
                }else{
                    
                    Category.CategoryModel.editCat_Post_NoImage(req.params.id,oldimage,req.body.name_vi)
                   
                res.redirect("/listcats")
                }
        }
        })
    }else{
        res.redirect("/login_admin")
    }
            });
    app.get("/deletecats", async (req, res) => {
        if(req.session.email&&req.session.pass){
            await Category.CategoryModel.deletCat(req.query.id)
            res.redirect("/listcats")
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