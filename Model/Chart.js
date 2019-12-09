let db = require("./Config")
const ChartModel={
    getFeedBack:async function(){
        const listfeedback = []
        await db.collection("Feedback").get().then(snapshot => {
            snapshot.forEach(doc => {
                listfeedback.push(doc.data())//feedback

            })

    })
   return listfeedback
},
    getProID:async function(){
        const listfeedback= await this.getFeedBack()
        const listproID=[]
        await listfeedback.forEach((arr)=>{
            listproID.push(arr.proID)
        })
     return listproID;
    },
    getprobyID:async function(){
        const listproID=await this.getProID()//proid
        const listprobyID=[]
        for (var i = 0; i < listproID.length ; i++){
            await db.collection('Product')
            .where('proID','==',listproID[i])
            .get().then(snapshot =>{
                if(snapshot.empty){
                    console.log("No document")
                }
                snapshot.forEach(doc =>{
                    this.listprobyID = []
                    listprobyID.push(doc.data())
                })
                return;

            })
        }
            
        return listprobyID
    }

}
module.exports={
    ChartModel
}