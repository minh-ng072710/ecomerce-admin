module.exports=function(app,makeid,db,moment){
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
    
}