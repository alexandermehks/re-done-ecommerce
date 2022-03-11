const vm = new Vue({
    el: "#app",
    data: {
        loggedin: {},

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

            if ($('#InputEmail').val() == $('#ConfirmInputEmail').val()) {


                const user = {

                    "userID": this.loggedin.id,
                    "name": this.loggedin.name,
                    "role": this.loggedin.role,
                    "email": $('#InputEmail').val(),
                }

                console.log("email-user", user);
                $.ajax({
                    url: '/admin/editUser',
                    method: "PUT",
                    data: user,
                    success: (result) => {
                        console.log("email changed", result);

                        $.ajax({
                            url: '/auth/updateEmail',
                            method: "POST",
                            data: user,
                            success: (result) => {
                                console.log("Logged in user updated", result)
                                this.getLoggedInUser();
                            }
                        });
                    },
                });
            } else {
                window.alert("Enter same Emailadress")
                console.log("please enter same email")
            }
        },
        updatePassword() {
            if ($('#InputPassword').val() == $('#ConfirmInputPassword').val()) {

            const user = {
                "userID": this.loggedin.id,
                "name": this.loggedin.name,
                "email": this.loggedin.email,
                "role": this.loggedin.role,
                "password": $('#InputPassword').val(),
            }
            console.log(user);
            $.ajax({
                url: '/admin/editUser',
                method: "put",
                data: user,
                success: () => {
                    console.log("password changed")
                },
            });
        } else {
            window.alert("Enter same Password")
            console.log("please enter same password")
        }
        },
    }



});








//Notes 
// UPDATE user SET password = getelementbydocument WHERE userID =  (this.loggedin.id)