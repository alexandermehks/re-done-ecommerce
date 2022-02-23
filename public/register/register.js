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
     		console.log(username, password, email, confirm_password);

     		if (password === confirm_password) {

     		}
     		else{
     			alert("Passwords dont match");
					   		

     		}


     	},



     },


     mounted() {


     }





});
