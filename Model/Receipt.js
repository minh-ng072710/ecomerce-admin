let db = require("./Config")
var moment = require('moment')

const ReceiptModel = {
    getAll: async function () {
        const listReceipt = []
        await db.collection('Receipt').get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    listReceipt.push(doc.data())
                });

            })
        return listReceipt       
    },

    cmpReceiptID : async function (){
        const listreceiptID = []
        let cpmReceipt = await this.getAll()
        cpmReceipt.forEach((arr) => {
            listreceiptID.push(arr.receiptID)
        })
        //console.log("Get all ID Receipt : " +listreceiptID)
        return listreceiptID
    },


    getOrderDetail:async function(){
       const Orderdetail = await this.cmpReceiptID()
       const listOrderdetail = []
       
        // Orderdetail.forEach(async(ar2) => {
        //     let Orders = []
        //     await db.collection('OrderDetail')
        //     .where('receiptID', '==', ar2).get()
        //         .then(snapshot => {
        //             snapshot.forEach(doc => {
        //                 listOrderdetail.push(doc.data())
        //             })
                   
        //         })
        // })
        for (var i = 0; i < Orderdetail.length ; i++){
            console.log("Current Item :" + Orderdetail[i])
            await db.collection('OrderDetail')
            .where('receiptID','==',Orderdetail[i])
            .get().then(snapshot =>{
                if(snapshot.empty){
                    console.log("No document")
                }

                snapshot.forEach(doc =>{
                    this.listOrderdetail = []
                    listOrderdetail.push(doc.data())
                })
                return;
            })
        
        
        }
        console.log("List Current Cmp: ")
        console.log(listOrderdetail)
        return listOrderdetail

    },


    editOrder:async function(id){
        let listbyid;
       await db.collection('Receipt').where('receiptID', '=', id).get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        listbyid = doc.data()

                    });
    })
     return listbyid

    },
    editOrderPost:async function(id){
        let ts = Date.now();
        let date_ob = (new Date(ts)).toString();
        let date = moment(date_ob).format("YYYY-MM-DD  HH:mm:ss")

        let docRef = db.collection('Receipt').doc(id)
        let updateMany = docRef.update({
            status:req.body.statuss,
            deliveryAdd:req.body.address,
            date:date

        });
    },
    delete:function(id){
        db.collection('Receipt').doc(id).delete();
        var jobskill_query = db.collection('OrderDetail').where('receiptID', '==', id);
        jobskill_query.get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                doc.ref.delete();
            });
        });

    }
}
module.exports = {
    ReceiptModel
}