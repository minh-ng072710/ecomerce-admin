var User_Admin = require("../Model/User_Admin")
module.exports = function (app, makeid, db, bcrypt, saltRounds, multer, moment, fs, Upload) {
    //listadmin
    app.get("/listadmin", (req, res, next) => {
        if (req.session.email && req.session.pass) {

            res.render("Home", {
                pages: "Admin_List",

                username: req.session.username,
                url: req.session.image

            })
        } else {

            res.redirect("./login_admin")
        }

    });
    //adduser_admin:GET
    app.get("/adduser_admin", (req, res) => {
        if (req.session.email && req.session.pass) {
            res.render("Home", {
                pages: "Add_User_Admin",
                username: req.session.username,
                url: req.session.image
            })
        } else {
            res.redirect("/login_admin")
        }
    });
    //adduser_admin:POST
    app.post("/adduser_admin", function (req, res) {
        if (req.session.email && req.session.pass) {
            var id = makeid(20);
            Upload(req, res, (err) => {
                bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
                    if (err) {
                        console.log(err);
                    } else {
                        User_Admin.User_AdminModel.addUser(
                            req.body.username,
                            req.body.address,
                            hash,
                            req.body.gender,
                            req.body.email,
                            req.body.txtEmpPhone,
                            req.file.filename

                        )

                        res.redirect("./listadmin")
                    }

                });

            })
        } else {
            res.redirect("/login_admin")
        }
    });
    //edituser_admin:GET  
    app.get("/edituser_admin", async (req, res) => {
        if (req.session.email && req.session.pass) {
            let list = await User_Admin.User_AdminModel.editUser(req.query.id)
            res.render("Home", {
                pages: "Edit_User_Admin",
                username: req.session.username,
                url: req.session.image,
                listuser: list

            });


        } else {
            res.redirect("/login_admin")
        }
    });
    //edituser_admin:POST
    app.post("/edituser_admin/:id", (req, res) => {
        if (req.session.email && req.session.pass) {
            Upload(req, res, (err) => {
                bcrypt.hash(req.body.pass, saltRounds, (err, hash) => {
                    if (err instanceof multer.MulterError) {
                        console.log("A Multer error occurred when uploading.");
                    } else if (err) {
                        console.log("An unknown error occurred when uploading." + err);
                    } else {
                        let oldimage = req.body.oldimage;
                        let oldpass = req.body.oldpass;
                        if (typeof req.file !== undefined && req.file) {
                            console.log("Upload is okay");
                            let ts = Date.now();
                            let date_ob = (new Date(ts)).toString();
                            let date = moment(date_ob).format("YYYY-MM-DD hh:mm:ss")

                            let cityRef = db.collection('Admin').doc(req.params.id);
                            if (oldpass == req.body.pass) {
                                User_Admin.User_AdminModel.editUser_Post_Image(
                                    req.params.id,
                                    req.body.username,
                                    req.body.address,
                                    oldpass,
                                    req.body.gender,
                                    req.body.email,
                                    req.body.txtEmpPhone,
                                    req.file.filename
                                )
                            } else {
                                User_Admin.User_AdminModel.editUser_Post_Image(
                                    req.params.id,
                                    req.body.username,
                                    req.body.address,
                                    hash,
                                    req.body.gender,
                                    req.body.email,
                                    req.body.txtEmpPhone,
                                    req.file.filename
                                )
                            }


                            res.redirect("/listadmin")
                        } else {
                            console.log("Upload is okay");
                            let ts = Date.now();
                            let date_ob = (new Date(ts)).toString();
                            let date = moment(date_ob).format("YYYY-MM-DD hh:mm:ss")

                            let cityRef = db.collection('Admin').doc(req.params.id);
                            if (oldpass == req.body.pass) {
                                User_Admin.User_AdminModel.editUser_Post_NoImage(
                                    req.params.id,
                                    req.body.username,
                                    req.body.address,
                                    oldpass,
                                    req.body.gender,
                                    req.body.email,
                                    req.body.txtEmpPhone,
                                    oldimage
                                )
                            } else {
                                User_Admin.User_AdminModel.editUser_Post_NoImage(
                                    req.params.id,
                                    req.body.username,
                                    req.body.address,
                                    hash,
                                    req.body.gender,
                                    req.body.email,
                                    req.body.txtEmpPhone,
                                    oldimage
                                )
                            }

                            res.redirect("/listadmin")

                        }
                    }

                });

            })
        } else {
            res.redirect("/login_admin")
        }
    });
    //deleteuser-admin         
    app.get("/deleteuser_admin", async (req, res) => {
        if (req.session.email && req.session.pass) {
            // if (req.query.url != "") {
            //     const path = 'Public/Upload/' + req.query.url;
            //     try {
            //         if (fs.existsSync(path)) {
            //             fs.unlinkSync(path);
                   await User_Admin.User_AdminModel.deleteUser_Admin(req.query.id)
                   res.redirect("/login_admin")
            //    )     } else {

            //             var db1 = db.collection('Admin').doc(req.query.id).delete();

            //         }
            //     } catch (err) {
            //         console.error(err)
            //     }
            //     res.redirect("/listadmin")
            // } else if (req.query.url == null) {
            //     var db1 = db.collection('Admin').doc(req.query.id).delete(;

            // }
        } else {
            res.redirect("/logout")
        }
    })
}
