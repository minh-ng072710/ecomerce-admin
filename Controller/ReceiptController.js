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
        app.post("/editorder/:id", async (req, res) => {
            await Receipt.ReceiptModel.editOrderPost(
                req.params.id,
                req.body.statuss,
                req.body.address
                
                )
            res.redirect("/listorder")
        })
        app.get("/deleteorder",async(req,res)=>{
            await Receipt.ReceiptModel.delete(req.query.id)
            res.redirect("/listorder")
        })
        
    
})
}