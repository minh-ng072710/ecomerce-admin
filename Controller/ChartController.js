
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
app.get("/chart/statistical_receipt",(req,res)=>{
    res.render("Home",{
        pages: "Statistical_Receipt",
        username: req.session.username,
        url:  req.session.image,
    })
})
app.get('/testfavor',(req,res)=>{
    let list =[]
    let proID = []
    let feedback = []
    let listid=[]
    db.collection("Product")
        .onSnapshot(function (doc) {

            db.collection("Product").get().then(snapshot => {
                snapshot.forEach(doc => {
                    list.push(doc.data())//feedback

                })
                list.forEach((arr) => {
                    
                    proID.push(arr.proID)
                })

                proID.forEach((arr3)=>{
                    var db1 = db.collection('Feedback').where('proID','=',arr3).get()
                    .then((snapshot) => {
                        snapshot.forEach((doc) => {
                            // console.log(doc.id, '=>', doc.data());
                            feedback.push(doc.data())
                            // console.log(list)
                         

                        });
                        feedback.forEach((arr5)=>{
                            listid.push(arr5.proID)
                        })
               
                        console.log(listid)
                })
               
        
            })

            })

})
})
app.get('/testreceipt',(req,res)=>{
    let list =[]
    let listname=[]
    let listprice=[]
    db.collection("Receipt")
    .onSnapshot(function (doc) {
        db.collection("Receipt").get().then(snapshot => {
            snapshot.forEach(doc => {
                list.push(doc.data())//feedback

            })
            list.forEach(arr=>{
                listname.push(arr.status),
                listprice.push(arr.totalPrice)

            })
            
    })
})
})
}