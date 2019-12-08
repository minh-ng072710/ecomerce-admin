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
const User_AdminModel = {

    addUser: function (username, address, hash, gender, email, txtEmpPhone, image) {
        var id = makeid(20)
        let ts = Date.now();
        let date_ob = (new Date(ts)).toString();
        let date = moment(date_ob).format("YYYY-MM-DD HH:mm:ss")

        let docRef = db.collection('Admin').doc(id).set({


            AcFullName: username,
            Address: address,
            Passwords: hash,
            Gender: gender,
            Email: email,
            Phone: txtEmpPhone,
            Time: date,
            url: "https://nguyengiaminh.herokuapp.com/Upload/" + image,
            id: id,


        });

    },
    editUser: async function (id) {
        let list = [];
        await db.collection('Admin').where('id', '=', id).get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {

                    return list.push(doc.data())

                });
            })
        return list;
    },
    editUser_Post_Image: async function (id, username, address, oldpass, gender, email, txtEmpPhone, image) {
        let ts = Date.now();
        let date_ob = (new Date(ts)).toString();
        let date = moment(date_ob).format("YYYY-MM-DD HH:mm:ss")

        let cityRef = db.collection('Admin').doc(id);

        let updateMany = cityRef.update({


            AcFullName: username,
            Address: address,
            Passwords: oldpass,
            Gender: gender,
            Email: email,
            Phone: txtEmpPhone,
            Time: date,
            url: "https://nguyengiaminh.herokuapp.com/Upload/" + image,


        });

    },
    editUser_Post_NoImage: async function (id, username, address, oldpass, gender, email, txtEmpPhone, image) {
        let ts = Date.now();
        let date_ob = (new Date(ts)).toString();
        let date = moment(date_ob).format("YYYY-MM-DD HH:mm:ss")

        let cityRef = db.collection('Admin').doc(id);

        let updateMany = cityRef.update({


            AcFullName: username,
            Address: address,
            Passwords: oldpass,
            Gender: gender,
            Email: email,
            Phone: txtEmpPhone,
            Time: date,
            url: image,


        });

    },
    deleteUser_Admin:async function(id){
        var db1 = db.collection('Admin').doc(id).delete();
    }

}
module.exports = {
    User_AdminModel
}