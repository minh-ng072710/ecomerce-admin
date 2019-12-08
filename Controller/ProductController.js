var Product = require("../Model/Product")

module.exports = function (app, makeid, db, multer, moment, fs, Upload) {

    app.get("/listproduct", async (req, res) => {
        // let ts = Date.now();
        // let date_ob = (new Date(ts)).toString();
        // let date = moment(date_ob).format("YYYY-MM-DD 00:00:00")
        // console.log(date)
    if (req.session.email && req.session.pass) {
            var listproduct = await Product.ProductModel.GetALL()
 return res.render("Home", {
                pages: "Product_List",
                username: req.session.username,
                url: req.session.image,
                list: listproduct,
});

} else {
            res.redirect("/login_admin")
        }
    })
    //addproduct
    app.get("/addproduct", async (req, res) => {
        if (req.session.email && req.session.pass) {
            let listproduct = await Product.ProductModel.listcategory()
            res.render("Home", {
                pages: "Add_Product",
                username: req.session.username,
                url: req.session.image,
                listcats: listproduct
            })

        } else {
            res.redirect("/login_admin")
        }

    })
    app.post("/addproduct",(req, res) => {
      if (req.session.email && req.session.pass) {
        Upload(req, res, (err) => {
                if (err instanceof multer.MulterError) {
                    console.log("A Multer error occurred when uploading.");
                } else if (err) {
                    console.log("An unknown error occurred when uploading." + err);
                } else {
                  
                    Product.ProductModel.AddProduct(
                        req.body.category, 
                        req.body.description,
                        req.body.name, 
                        req.body.price, 
                        req.body.quantity, 
                        req.body.volumtric, 
                        req.file.filename
)
                }
            })


            res.redirect("./listproduct")
        } else {
            res.redirect("/login_admin")

        }

    });

    app.get("/editproduct", async (req, res) => {
        if (req.session.email && req.session.pass) {
            let datestart;
            let hourstart;
            let dateend;
            let hourend;

            let list1 = await Product.ProductModel.listcategory()
            let list = await Product.ProductModel.getProID(req.query.id)
            let tsstart = list.startSale

            let date_ob_start = (new Date(tsstart)).toISOString();
            datestart = moment(date_ob_start).format("YYYY-MM-DD");
            hourstart = moment(date_ob_start).format("HH:mm:ss");

            let tsend = list.endSale
            let date_ob_end = (new Date(tsend)).toISOString();
            dateend = moment(date_ob_end).format("YYYY-MM-DD");
            hourend = moment(date_ob_end).format("HH:mm:ss");
            res.render("Home", {
                pages: "Edit_Product",
                username: req.session.username,
                url: req.session.image,
                listcats: list,
                listcats1: list1,
                time_start: datestart,
                hour_start: hourstart,
                full_timestart: tsstart,
                time_end: dateend,
                hour_end: hourend,
                full_timeend: tsend,
            });
        } else {
            res.redirect("/login_admin")
        }
    });
    

    app.get("/editproduct1", async (req, res) => {
        if (req.session.email && req.session.pass) {
            let datestart;
            let hourstart;
            let dateend;
            let hourend;

            let list1 = await Product.ProductModel.listcategory()
            let list = await Product.ProductModel.getProID(req.query.id)
            let tsstart = list.startSale

            let date_ob_start = (new Date(tsstart)).toISOString();
            datestart = moment(date_ob_start).format("YYYY-MM-DD");
            hourstart = moment(date_ob_start).format("HH:mm:ss");

            let tsend = list.endSale
            let date_ob_end = (new Date(tsend)).toISOString();
            dateend = moment(date_ob_end).format("YYYY-MM-DD");
            hourend = moment(date_ob_end).format("HH:mm:ss");
            res.render("Home", {
                pages: "Edit_Product",
                username: req.session.username,
                url: req.session.image,
                listcats: list,
                listcats1: list1,
                time_start: datestart,
                hour_start: hourstart,
                full_timestart: tsstart,
                time_end: dateend,
                hour_end: hourend,
                full_timeend: tsend,
            });
        } else {
            res.redirect("/login_admin")
        }


    });
    app.get("/editproduct2", async (req, res) => {
        if (req.session.email && req.session.pass) {
        let listcategory = await Product.ProductModel.listcategory()
        console.log(listcategory)
        let newlist = await Product.ProductModel.getProID(req.query.id)

        res.render("Home", {
            pages: "Edit_Product2",
            username: req.session.username,
            url: req.session.image,
            listcats1: listcategory,
            listcats: newlist,

        });

    } else {
        res.redirect("/login_admin")
    }

    })
    
    app.post("/editproduct/:id", async (req, res) => {
        let ts = Date.now();
        if (req.session.email && req.session.pass) {
            Upload(req, res, (err) => {
                if (err instanceof multer.MulterError) {
                    console.log("A Multer error occurred when uploading.");
                } else if (err) {
                    console.log("An unknown error occurred when uploading." + err);
                } else {
                    let oldimage = req.body.oldimage
                    if (typeof req.file !== undefined && req.file) {
                        let catID = req.body.category
                        let description = req.body.description
                        let name = req.body.name
                        let price = req.body.price
                        let quantity = req.body.quantity
                        let volumetric = req.body.volumtric
                        let image = req.file.filename

                        Product.ProductModel.EditProduct_Image(req.params.id, catID, description, name, price, quantity, volumetric, image)

                    } else {
                        let catID = req.body.category
                        let description = req.body.description
                        let name = req.body.name
                        let price = req.body.price
                        let quantity = req.body.quantity
                        let volumetric = req.body.volumtric
                        let image = oldimage

                        Product.ProductModel.EditProduct_NoImage(req.params.id, catID, description, name, price, quantity, volumetric, image)
                    }
                    res.redirect("/listproduct")
                }
            })
        } else {
            res.redirect("/login_admin")
        }
    });



    app.post("/flashsale", async (req, res) => {

        let tsstart = req.body.startsale;
        let date_ob_start = (new Date(tsstart)).toISOString();
        let datestart = moment(date_ob_start).format("YYYY-MM-DD HH:mm:ss");

        let tssend = req.body.endsale;
        let date_ob_end = (new Date(tssend)).toISOString();
        let dateend = moment(date_ob_end).format("YYYY-MM-DD HH:mm:ss");

        let ts = Date.now();
        // let oldend = req.body.endsale_old;

        await Product.ProductModel.Flashsale(req.query.id, dateend, datestart, req.body.discount_percent)


        res.redirect("/listproduct")
    })
    app.post("/deletesale/:id",async (req, res) => {

        await Product.ProductModel.DeleteSale(req.params.id)
        res.redirect("/listproduct")
    })





    app.get("/deleteproduct", async (req, res) => {
        if (req.session.email && req.session.pass) {
                await Product.ProductModel.DeleteAll(req.query.id,req.query.url)
                res.redirect("/listproduct")
            
        } else {
            res.redirect("/login_admin")
        }
    })
}