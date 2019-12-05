var FeedbackModel={
    GetAll:function(){
        let list = [];
        let observer = db.collection('Product').get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    list.push(doc.data())
                });
          
                return res.render("Home", {
                    pages: "Feedback_List",
                    username: req.session.username,
                    url:  req.session.image,
                    list: list,
                    
                });
            })
    }
}
