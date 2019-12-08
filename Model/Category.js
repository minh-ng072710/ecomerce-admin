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
    addCat:async function(){
        
    }

}
module.exports={
    CategoryModel
}