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
var moment = require('moment')
var FeedbackModel = {
    GetAll: function () {

        let list = [];
        let observer = db.collection('Feedback').get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    list.push(doc.data())
                });


            })


    },

    ListProduct: function () {//chua dc
        let listpro = [];

        let observer = db.collection('Product').get()
            .then(snapshot1 => {
                snapshot1.forEach(doc1 => {
                    listpro.push(doc1.data())
                });
            })

    },
    AddFeedBack: function (content, email, proID,rating) {
        id = makeid(20)
        let ts = Date.now();
        let date_ob = (new Date(ts)).toString();
        let date = moment(date_ob).format("YYYY-MM-DD  HH:mm:ss")




        let docRef = db.collection('Feedback').doc(id).set({

            content: content,
            date: date,
            email: email,
            proID: proID,
            fbID: id,
            rating:rating
        });
    },
    getFeedbackByID:async function(){

    },

    Delete: function (id) {
        var db1 = db.collection('Feedback').doc(id).delete();
    }



}
module.exports = FeedbackModel