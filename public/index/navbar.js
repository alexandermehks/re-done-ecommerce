const navbarvm = new Vue({
     el: "#navbarapp",
     data: {
          loggedin: {},
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

          logOut() {
               $.ajax({
                    url: '/auth/logout',
                    type: 'GET',
                    success: (result) => {
                         location.reload();
                    }
               })
          },



     },


     mounted() {










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











