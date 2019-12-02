module.exports=function(app,makeid,db,moment){
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
}