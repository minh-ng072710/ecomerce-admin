

var Receipt = require("../Model/Receipt")
module.exports = function (app, makeid, db, multer, moment, fs, Upload) {

    app.get("/listorder", async (req, res) => {
        let list = await Receipt.ReceiptModel.getOrderDetail();

        return res.render("Home", {
            pages: "Order_List",
            username: req.session.username,
            url: req.session.image,
            list: list,

        });


    });

    app.get("/editorder", async (req, res) => {

        let list = await Receipt.ReceiptModel.editOrder(req.query.id)
        res.render("Home", {
            pages: "Edit_Order",
            list: list,
            username: req.session.username,
            url: req.session.image,



        });




    })


    app.post("/addfeedback", async (req, res) => {

        var content = req.body.content
        var email = req.body.email
        var proID = req.body.nameproduct
        var rating = req.body.rating
        if (req.session.email && req.session.pass) {
            var insert = await Feedback.AddFeedBack(content, email, proID, rating)

            res.redirect("./listfeedback")
        } else {
            res.redirect("/login_admin")

        }
    });

    app.get("/deleteorder", async (req, res) => {

        await Receipt.ReceiptModel.delete(req.query.id)
        res.redirect("/listfeedback")

    })
}