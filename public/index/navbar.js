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
          }

     },


     mounted() {








     }





});

navbarvm.getLoggedInUser();







