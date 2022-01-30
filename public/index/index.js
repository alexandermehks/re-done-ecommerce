const vm = new Vue({
     el: "#app",
     data: {

     },

     methods: {
          do_test() {
               console.log("From index.js")
          },

          getUser() {
               $.ajax({
                    url: '/user/users',
                    type: 'GET',
                    success: (result) => {
                         const element = document.getElementById("FAK")
                         if (element.style.color === "red") {
                              element.setAttribute("style", "color:black");
                         }
                         else {
                              element.setAttribute("style", "color:red");
                         }
                         console.log(result[0].name)

                    }
               })

          }
     }




})


frontend / index.js
     / home / am / git / kingnation / frontend / index.js