
module.exports=function(app,makeid,db,bcrypt,saltRounds,multer,moment,fs,Upload){

app.get("/chart",(req,res)=>{
    res.render("Home",{
        pages: "Statistical",
        username: req.session.username,
        url:  req.session.image,
    })
})
app.get('/testabc',(req,res)=>{
    let list=[];
db.collection("Product")
.onSnapshot(function (doc) {
    doc.docChanges().forEach((change) => {

    })
    db.collection("Product").get().then(snapshot =>{
        snapshot.forEach(doc=>{
            list.push(doc.data())
            
    })
  console.log(list)
    list.forEach((arr)=>{
        console.log(arr.price)
       
   
})

})
})
})
}