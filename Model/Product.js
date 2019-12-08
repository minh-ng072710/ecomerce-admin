let db = require("./Config")

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const ProductModel = {
    GetALL: function () {
        let list2 = [];
        let observer = db.collection('Product').get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    list2.push(doc.data())
                });
            })
    },
    AddProduct: async function (catID, description, name, price, quantity, volumetric, image) {
        var id = makeid(20)
        let ts = Date.now();

        let docRef = db.collection('Product').doc(id).set({

            catID: catID,
            description: description,
            discount: 0,
            endSale: '',
            imgURL: "https://nguyengiaminh.herokuapp.com/Upload/" + image,
            isSale: 0,
            name: name,
            price: parseInt(price),
            proID: id,
            quantity: parseInt(quantity),
            startSale: '',
            volumetric: parseInt(volumetric),
            date: ts




        });

    },
    EditProduct_Image: async function (proID, catID, description, name, price, quantity, volumetric, image) {
        let ts = Date.now();
        let cityRef = await db.collection('Product').doc(proID);

        let updateMany = cityRef.update({


            catID: catID,
            description: description,
            imgURL: "nguyengiaminh.herokuapp.com/Upload/" + image,
            name: name,
            price: parseInt(price),

            quantity: quantity,
            volumetric: volumetric,

            date: ts

        });
    },
    EditProduct_NoImage: async function (proID, catID, description, name, price, quantity, volumetric, image) {
        let ts = Date.now();
        let cityRef = await db.collection('Product').doc(proID);

        let updateMany = cityRef.update({


            catID: catID,
            description: description,
            imgURL: image,
            name: name,
            price: price,

            quantity: parseInt(quantity),
            volumetric: parseInt(volumetric),

            date: ts

        });
    },

    getProID: async function (proID) {
        const listcats = [];
        await db.collection('Product').where('proID', '=', proID).get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {

                    product = doc.data();

                });

            })
        return product
    },
    listcategory: async function () {
        console.log("saadfasg")
        const listCates = []
        await db.collection("Category").get().then((snapshot) => {
            snapshot.forEach((arr) => {
                listCates.push(arr.data())
            })
        })

        return listCates
    },
    Flashsale: async function (id, dateend, datestart, discount) {
        let ts = Date.now();

        let cityRef = db.collection('Product').doc(id);
        let updateMany = cityRef.update({


            discount: parseInt(discount),
            endSale: dateend,
            startSale: datestart,
            isSale:0,
            date: ts,


        })

    },
    DeleteSale: async function (id) {
        let cityRef = db.collection('Product').doc(id);
        let updateMany = cityRef.update({


            discount: 0,
            endSale: '',
            startSale: '',
            isSale: 0,

        });
    },
    DeleteAll: async function (id, url) {

        // const path = '../Upload/' + url;
        // try {
        // //     if (fs.existsSync(path)) {
        //         fs.unlinkSync(path);
        // //         var db1 = db.collection('Product').doc(id).delete();
        //     } else {

        db.collection('Product').doc(id).delete();
        var jobskill_query = db.collection('Feedback').where('proID', '==', id);
        jobskill_query.get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                doc.ref.delete();
            });
        });



        // } catch (err) {
        //     console.error(err)
        // }

    }
}

module.exports = {
    ProductModel
}
