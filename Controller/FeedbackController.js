

var Feedback = require("../Model/Feedback.js")
module.exports = function (app, makeid, db, multer, moment, fs, Upload) {
    app.get("/listfeedback", async (req, res) => {
        if (req.session.email && req.session.pass) {
            var ListFeedBack = await Feedback.GetAll()
            return res.render("Home", {
                pages: "Feedback_List",
                username: req.session.username,
                url: req.session.image,
                list: ListFeedBack,
            });
        } else {
            res.redirect("/login_admin")
        }
    });
    app.get("/addfeedback", async (req, res) => {
        if (req.session.email && req.session.pass) {
            let list = [];
            let observer = await db.collection('Product').get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        list.push(doc.data())
                    });
                    return res.render("Home", {
                        pages: "Add_FeedBack",
                        username: req.session.username,
                        url: req.session.image,
                        listfeedback: list
                    })
                })
        } else {
            res.redirect("/login_admin")
        }
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
    app.get("viewdetail",(req,res)=>{
            
    })
    app.get("/deletefeedback", async (req, res) => {
        var id = req.query.id
        if (req.session.email && req.session.pass) {
            var delele = await Feedback.Delete(id)
            res.redirect("/listfeedback")
        } else {
            res.redirect("/login_admin")
        }
    })
}