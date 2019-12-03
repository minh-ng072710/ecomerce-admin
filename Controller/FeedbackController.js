module.exports=function(app,makeid,db,moment){
    app.get("/listfeedback",(req,res)=>{

        if(req.session.email&&req.session.pass){
            let list = [];
            let observer = db.collection('Product').get()
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
                    proID:req.body.nameproduct,
                    fbID:id+'pro'+req.body.nameproduct
                });
                res.redirect("./listfeedback")
    
            
            }else{
                res.redirect("/login_admin")
            
            }
            });  
        
app.get("/deletefeedback", (req, res) => {
    
        if(req.session.email&&req.session.pass){
        var db1 = db.collection('Feedback').doc(req.query.id).delete();
           
          res.redirect("/listfeedback")
        }else{
            res.redirect("/login_admin")
        }
      
    
    })   
}