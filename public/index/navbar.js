const navbarvm = new Vue({
     el: "#navbarapp",
     data: {
          loggedin: {},
          searched: [],
          shoppingitem: 0
     },

     methods: {



          logIn() {
               let valid = true;
               let typed_data = {
                    password: document.getElementById("password").value,
                    email: document.getElementById("login").value,

               };
               console.log(typed_data)
               if (typed_data.password === "" || typed_data.email === "" || typed_data.password === "" && typed_data.email === "") {
                    console.log("invalid credentials")
                    valid = false;
               }
               location.reload()
               if (valid) {
                    $.ajax({
                         url: '/auth/doLogIn',
                         type: 'POST',
                         data: typed_data,
                         success: (result) => {

                         }
                    })
               }
          },

          getLoggedInUser() {
               $.ajax({
                    url: '/auth/loggedInUser',
                    type: 'GET',
                    success: (result) => {
                         this.loggedin = result;


                    }
               })
          },
          updateCart(){
               const user = this.getLoggedInUser()
               this.shoppingitem = user.shoppingcart[0].amount

          },

          logOut() {
               $.ajax({
                    url: '/auth/logout',
                    type: 'GET',
                    success: (result) => {
                         location.reload();
                    }
               })
          },


          search(){
               var search_arg = document.getElementById('search-input').value;
               let obj = {
                    "searchString": search_arg
               } 
               $.ajax({
                    url: '/products/search',
                    type: 'POST',
                    data: obj,
                    success: (result) => {
                         let final = {};
                         let size = Object.keys(result);
                         for (let v of size){
                              console.log(result[v])
                              //If key exists
                             if(result[v].prodID in final){
                                   final[result[v].prodID].push(result[v]);
                             }else{
                                   final[result[v].prodID] = [result[v]];

                             }
                         }
                         console.log(final)
                         this.searched = final;

                         
                    }
               })
          },
          
          





     },


     mounted() {


          $updateCart()





         

     }





});

navbarvm.getLoggedInUser();



function onSignIn(googleUser) {
     let user = {}
     user['status'] = true;
     var profile = googleUser.getBasicProfile();
     user['name'] = profile.getName();
     //user['image'] = profile.getImageUrl();
     user['email'] = profile.getEmail();
     user['type'] = "GOOGLE";
     user['id'] = profile.getId();
     console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
     console.log('Name: ' + profile.getName());
     console.log('Image URL: ' + profile.getImageUrl());
     console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
     navbarvm.loggedin = user;
}


function signOut() {
     var auth2 = gapi.auth2.getAuthInstance();
     auth2.signOut().then(function () {
          console.log('User signed out.');
     });
     location.reload();
}












