let db = require("./Config")
const UserModel={
    delete:function(id){
        var db1 = db.collection('User').doc(id).delete();
    }
}
module.exports={
    UserModel
}