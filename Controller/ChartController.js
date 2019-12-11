var Chart = require("../Model/Chart")
module.exports = function (app, makeid, db, bcrypt, saltRounds, multer, moment, fs, Upload) {

    app.get("/chart/statistical_price", (req, res) => {

        res.render("Home", {
            pages: "Statistical_Price",
            username: req.session.username,
            url: req.session.image,
        })
    })
    app.get("/chart/statistical_favorite", (req, res) => {
        res.render("Home", {
            pages: "Statistical_Favorite",
            username: req.session.username,
            url: req.session.image,
        })
    })
    app.get("/chart/statistical_receipt", (req, res) => {
        res.render("Home", {
            pages: "Statistical_Receipt",
            username: req.session.username,
            url: req.session.image,
        })
    })
    app.get('/testfavor', async (req, res) => {

        // res.render("Home", {
        //     pages: "Statistical_Favorite",
        //     username: req.session.username,
        //     url: req.session.image,
        // })

        const listfeedback = []
        await db.collection("Feedback")
        .onSnapshot(async function (doc) {
            await db.collection("Feedback").get().then(snapshot => {
                snapshot.forEach(doc => {
                    listfeedback.push(doc.data())//feedback

                })
            })

            const listProduct = []
            await db.collection("Product").get().then(snapshot => {
                snapshot.forEach(doc => {
                    listProduct.push(doc.data())//feedback

                })
            })
            

            let listrating = []
            let lisproid = []
            
        
            let dem=0


            // for(var i = 0 ; i < listfeedback.length ; i++){
            //     for(var j = 0 ; j < listProduct.length ; j++){
            //         if (listProduct[j].proID == listfeedback[i].proID) {
            //             // listrating.push(listfeedback[i].rating)
            //             dem += listfeedback[i].rating
            //         }
            //         else{
                       
            //             dem = 0
            //         }
            //         listrating.push({rating:dem,id:listfeedback[i].proID})
            //         //lisproid.push(listfeedback.proID)
            //         console.log(listrating)
            //     }
            // }

            // let check = listfeedback[3].proID
            // for(var k = 0; k < listfeedback.length ; k++){
            //     if (listfeedback[k].proID ==check) {
            //         dem += listfeedback[k].rating
            //         check = listfeedback[k].proID
            //     }

            //     if (listfeedback[k].proID != check) {
            //         listrating.push({rating:dem,id:listfeedback[k].proID})
            //         check = listfeedback[k].proID
            //     }
            // }

           await listfeedback.forEach(async(arr) => { 
               await listProduct.forEach(async(arr1) =>{
                    if(arr.proID == arr1.proID){
                        dem += arr.rating
                    }else{
                        listrating.push({rating:dem,id:arr.proID})
                    }
                })
                lisproid.push(arr.proID)
            })

            console.log("Current Item Rating :" + dem)

            //console.log(listrating)

            
            let count=0;
            let listrating_new=[]
            let lisproid_new=[]
              for(let i=0;i<=listfeedback.length;i++){
                if(listfeedback[i].proID==listfeedback[i+1].proID){
                    count=count+listfeedback[i].rating
                   

                }else{
                    listrating_new.push({
                        id:listfeedback[i].proID,
                        rating:count
                    })
                    await listrating_new;
                    return listrating_new
               
                }
            }
            // console.log(listrating_new)
})
    })
    app.get('/testreceipt', (req, res) => {
        let list = []
        let listname = []
        let listprice = []
        db.collection("Receipt")
            .onSnapshot(function (doc) {
                db.collection("Receipt").get().then(snapshot => {
                    snapshot.forEach(doc => {
                        list.push(doc.data())//feedback

                    })
                    list.forEach(arr => {
                        listname.push(arr.status),
                            listprice.push(arr.totalPrice)

                    })

                })
            })
    })
}