const registervm = new Vue({
     el: "#registerapp",
     data: {

     },

     methods: {

     	register() {
     		const username = document.getElementById("username").value;
     		const password = document.getElementById("password").value;
     		const email = document.getElementById("email").value;
     		const confirm_password = document.getElementById("confirm_password").value;
               const user = {
                    username: username,
                    password: password,
                    confirm_password: confirm_password,
                    email: email,

               };

     		if (password === confirm_password) {
                    $.ajax({
                         url: '/user/users',
                         type: 'GET',
                         success: (result) => {
                              let ok = true;
                              for(let i = 0; i < result.length; i++){
                                   if (username === result[i].name){
                                        alert("Username already in use!")
                                        ok = false;
                                        break;
                                        }
                                   if (email === result[i].email){
                                        alert("Invalid credentials!")
                                        ok = false;
                                        break;
                                   }
                              
                              }
                              if(ok){
                                   $.ajax({
                                       url: '/user/register',
                                       type: 'POST',
                                       data: user,
                                       success: (result) => {
                                        window.location.assign("success")

                                       }

                                   });
                              }
                         }
                    });
                         


                    



     		}
     		else{
     			alert("Passwords dont match");
					   		

     		}


     	}



     },


     mounted() {


     }





});
