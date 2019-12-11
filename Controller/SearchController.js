var Search = require("../Model/Search")


module.exports = function (app, makeid, db, multer, moment, fs, Upload)  {
    app.get("/searchresult",async(req,res)=>{
        let listpro=await Search.SearchModel.getlistbykeysearch(req.query.key)
        res.render("Home",{ 
            pages:"test_pagination",
            username: req.session.username,
            url: req.session.image,
            list:listpro
        })
    })
}


