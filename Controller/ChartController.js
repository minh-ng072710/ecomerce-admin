
module.exports=function(app,makeid,db,bcrypt,saltRounds,multer,moment,fs,Upload){

app.get("/chart/statistical_price",(req,res)=>{
    res.render("Home",{
        pages: "Statistical_Price",
        username: req.session.username,
        url:  req.session.image,
    })
})
app.get("/chart/statistical_favorite",(req,res)=>{
    res.render("Home",{
        pages: "Statistical_Favorite",
        username: req.session.username,
        url:  req.session.image,
    })
})
app.get("/chart/statistical_sale",(req,res)=>{
    res.render("Home",{
        pages: "Statistical_Sale",
        username: req.session.username,
        url:  req.session.image,
    })
})
app.get('/testabc',(req,res)=>{
    let list = [];
    let proID = []
    let feedback = []
    db.collection("Favorite")
        .onSnapshot(function (doc) {

            db.collection("Favorite").get().then(snapshot => {
                snapshot.forEach(doc => {
                    list.push(doc.data())//feedback

                })
                list.forEach((arr) => {
                    
                    proID.push(arr.proID)
                })
                console.log(proID)

                proID.forEach((arr3)=>{
                    var db1 = db.collection('Product').where('proID','=',arr3).get()
                    .then((snapshot) => {
                        snapshot.forEach((doc) => {
                            // console.log(doc.id, '=>', doc.data());
                            feedback.push(doc.data())
                            // console.log(list)
                            console.log(feedback)

                        });
                        
                        // console.log(feedback)
                })

                
     

              

                // console.log(feedback)
             

        
                
              
            })

            })

})
})
}