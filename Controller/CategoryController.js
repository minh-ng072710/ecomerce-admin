const Category = require("../Model/Category")
module.exports = function (app, makeid, db, multer, moment, fs, Upload) {
    app.get("/listcats", async (req, res) => {
        if (req.session.email && req.session.pass) {
            let list = await Category.CategoryModel.getAll()
            return res.render("Home", {
                pages: "Categories_List",
                username: req.session.username,
                url: req.session.image,
                list: list,
            });
        } else {

            res.redirect("/login_admin")
        }

    });
    app.get("/addcats", (req, res) => {
        if (req.session.email && req.session.pass) {
            res.render("Home", {
                pages: "Add_Group_Product",
                username: req.session.username,
                url: req.session.image
            })
        } else {
            res.redirect("/login_admin")
        }
    });

    app.post("/addcats", function (req, res) {
        if (req.session.email && req.session.pass) {
            Upload(req, res, (err) => {
                if (err instanceof multer.MulterError) {
                    console.log("A Multer error occurred when uploading.");
                } else if (err) {
                    console.log("An unknown error occurred when uploading." + err);
                } else {
                    Category.CategoryModel.addCat(req.body.name_en, req.body.name_vi, req.file.filename)
                    res.redirect("./listcats")
                }
            });
        } else {
            res.redirect("/login_admin")
        }
    })
    app.get("/editcats", async (req, res) => {
        if (req.session.email && req.session.pass) {
            let list = await Category.CategoryModel.editCat(req.query.id)
            res.render("Home", {
                pages: "Edit_Cats",
                listcats: list,
                username: req.session.username,
                url: req.session.image

            });
        } else {
            res.redirect("/login_admin")
        }
    });

    app.post("/editcats/:id", async (req, res) => {
        if (req.session.email && req.session.pass) {
            Upload(req, res, (err) => {
                if (err instanceof multer.MulterError) {
                    console.log("A Multer error occurred when uploading.");
                } else if (err) {
                    console.log("An unknown error occurred when uploading." + err);
                } else {
                    let oldimage = req.body.oldimage
                    if (typeof req.file !== undefined && req.file) {
                        Category.CategoryModel.editCat_Post_Image(req.params.id, req.file.filename, req.body.name_vi)
                        res.redirect("/listcats")
                    } else {
                        Category.CategoryModel.editCat_Post_NoImage(req.params.id, oldimage, req.body.name_vi)
                        res.redirect("/listcats")
                    }
                }
            })
        } else {
            res.redirect("/login_admin")
        }
    });
    app.get("/deletecats", async (req, res) => {
        if (req.session.email && req.session.pass) {
            await Category.CategoryModel.deletCat(req.query.id)
            res.redirect("/listcats")
        } else {
            res.redirect("/login_admin")
        }

    })
}