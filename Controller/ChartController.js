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
 db.collection("Feedback")
            .onSnapshot(async function (doc) {
                let listfeedback = []
                await db.collection("Feedback").get().then(snapshot => {
                    snapshot.forEach(doc => {
                        listfeedback.push(doc.data())//feedback

                    })
                })
                let listrating = []

                let lisproid = []
                await listfeedback.forEach((arr) => {
                    listrating.push(arr.rating)
                    lisproid.push(arr.proID)
                })
                    console.lo


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