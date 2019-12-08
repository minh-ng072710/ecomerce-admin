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
const CategoryModel={
    getAll:async function(){
        const list = [];
        await db.collection('Catgories').get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    list.push(doc.data())
                });
              
    })
 return list
},
    addCat:async function(name_en,name_vi,image){
        let ts = Date.now();
        let date_ob = (new Date(ts)).toString();
        let date = moment(date_ob).format("YYYY-MM-DD  HH:mm:ss")
        db.collection('Category').doc(name_en).set({
            
            catID:name_en,
            imgURL:"http://nguyengiaminh.herokuapp.com/Upload/"+image,
            name:name_vi,
            
            time:date,


        });
    },
    editCat:async function(id){
        let list = [];
        await db.collection('Category').where('catID', '=', id).get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                
                     list.push(doc.data())
                
                });
    })
    return list

},
    editCat_Post_Image:async function(id,image,name_vi){
        let ts = Date.now();
        let date_ob = (new Date(ts)).toString();
        let date = moment(date_ob).format("YYYY-MM-DD  HH:mm:ss")
        let cityRef = db.collection('Category').doc(id);
        let updateMany = cityRef.update({
               
         
            imgURL:"http://nguyengiaminh.herokuapp.com/Upload/"+image, 
            name:name_vi,
        
            
            Time:date,
            
        
        });               
    },
    editCat_Post_NoImage:async function(id,image,name_vi){
        let ts = Date.now();
        let date_ob = (new Date(ts)).toString();
        let date = moment(date_ob).format("YYYY-MM-DD  HH:mm:ss")
        let cityRef = db.collection('Category').doc(id);
        let updateMany = cityRef.update({
               
         
            imgURL:image, 
            name:name_vi,
        
            
            time:date,
            
        
        });               
    },
    deletCat:async function(id){
       db.collection('Category').doc(id).delete();
       var jobskill_query = db.collection('Product').where('catID', '==', id);
       jobskill_query.get().then(function (querySnapshot) {
           querySnapshot.forEach(function (doc) {
               doc.ref.delete();
           });
       });

    }

}
module.exports={
    CategoryModel
}