var User = require("../Model/User")
module.exports = function (app, makeid, db, bcrypt, saltRounds, multer, moment, fs, Upload) {
    //listadmin
    app.get("/listuser", (req, res, next) => {

        if (req.session.email && req.session.pass) {
            

            return res.render("Home", {
                pages: "User_List",
                username: req.session.username,
                url: req.session.image,


            }
            );


        } else {
            res.redirect("/login_admin")
        }
    })
    
    
    app.get("/delete_user",async (req, res) => {
        if(req.session.email&&req.session.pass){
            await User.UserModel.delete(req.query.id)
        res.redirect("/listuser")
        }else{
            res.redirect("/login_admin")
        }
    })
  
    
}
