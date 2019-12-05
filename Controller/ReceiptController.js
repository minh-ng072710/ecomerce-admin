module.exports = function (app, makeid, db, moment) {
    app.get("/listorder", (req, res) => {
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
                    url: req.session.image,
                    list: list,

                });
            })
    });




    app.get("/editorder", (req, res) => {
        let list;
        let list1 = []
        var db2 = db.collection('Receipt').get().then((snapshot1) => {
            snapshot1.forEach((doc1) => {
                list1.push(doc1.data())
            })
            var db1 = db.collection('Receipt').where('receiptID', '=', req.query.id).get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        list = doc.data()

                    });

                    res.render("Home", {
                        pages: "Edit_Order",
                        list: list,
                        username: req.session.username,
                        url: req.session.image,
                        list1: list1


                    });
                })
        })


    })







    app.post("/editorder/:id", (req, res) => {
        id = makeid(20)
        let ts = Date.now();
        let date_ob = (new Date(ts)).toString();
        let date = moment(date_ob).format("YYYY-MM-DD  hh:mm:ss")




        let docRef = db.collection('Receipt').doc(req.params.id)
        let updateMany = docRef.update({


              deliveryAdd:req.body.address
        });
        res.redirect("/listorder")
    })

    app.get("/deletefeedback", (req, res) => {


        var db1 = db.collection('Feedback').doc(req.query.id).delete();

        res.redirect("/listfeedback")


    })

}