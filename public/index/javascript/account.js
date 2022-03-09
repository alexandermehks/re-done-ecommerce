
const vm = new Vue({
    el: "#app",
    data: {
        loggedin:{},

    },

    mounted() {
        $(function() {
            $("#navbar").load("navbar.html");
            $("#footer").load("footer.html");
        });
        this.getLoggedInUser();


    },
    methods: {
        getLoggedInUser() {
            $.ajax({
                url: '/auth/loggedInUser',
                type: 'GET',
                success: (result) => {
                    this.loggedin = result;
                    console.log(result);
                    console.log(result.id);
                    console.log(result.name);
                    console.log(result.email);
                    console.log(result.password); 
                }
            })
        },
        updateEmail() {
            const user = {

                "id": this.loggedin.id,
                "name": this.loggedin.name,
                "email": $('#InputEmail').val(),
                

            }
            $.ajax({
                url: '/admin/editUser',
                method: "put",
                data: user,
                success: () => {
                    $.getJSON("/admin/users/", function(jsondata) {
                        console.log(jsondata);

                    }.bind(this));
                    console.log("email changed");
                    

                },
            })
        },
    }

    
    
});
       
         






//Notes 
// UPDATE user SET password = getelementbydocument WHERE userID =  (this.loggedin.id)