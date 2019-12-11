let db = require("./Config")
var moment = require('moment')
const SearchModel = {
    getALL: async function () {
        const listproduct = []
        await db.collection('Product').get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    listproduct.push(doc.data())
                });

            })
        return listproduct
    },
    getName: async function () {
        const _list = await this.getALL();
        const name = []
        _list.forEach((arr) => {
            name.push(arr.name)
        })
        return name

    },
    search: async function (key) {
        const _listname = await this.getName()
        const searchresult = []

        _listname.forEach((arr) => {
            if (arr.includes(key)) {
                searchresult.push(arr)

            }
        })




        return searchresult;
    },
    getlistbykeysearch:async function(key){
        const listpro=await this.search(key);
        const list=[]

        for (var i = 0; i < listpro.length ; i++){
            await db.collection('Product')
            .where('name','==',listpro[i])
            .get().then(snapshot =>{
                if(snapshot.empty){
                    console.log("No document")
                }

                snapshot.forEach(doc =>{
                    this.list= []
                    list.push(doc.data())
                })
                return;
            })
    
        
        }
    return list
    }
}

module.exports = {
    SearchModel
}