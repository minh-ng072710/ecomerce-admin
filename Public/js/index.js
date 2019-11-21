
 

$(document).ready(function(){
   
    $("#btnRegister").click(function(){
   
        var email=$("#email").val();
        var password=$("#password").val();
        var confirmpassword=$("#confirmpassWord").val();
        if(email !="" && password!="" && confirmpassword !=""){
          if(password==confirmpassword){
  
            var result=firebase.auth().createUserWithEmailAndPassword(email,password)
          }else{
            window.alert("Xác Nhận Pass Sai");

          }
        }else{
          window.alert("Form sai")
        }
    }) 
})