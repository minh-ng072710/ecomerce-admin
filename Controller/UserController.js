module.exports=function(app,makeid,db,bcrypt,saltRounds,multer,moment,fs,Upload){
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
}