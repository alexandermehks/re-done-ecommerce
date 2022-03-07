const vm = new Vue({
    el: "#app",
    data: {
        testAccount: "luca123",
        users: []

    },

    mounted() {
        $(function() {
            $("#navbar").load("navbar.html");
            $("#footer").load("footer.html");
        });
        var self = this;
        $.getJSON("admin/users/", function(jsondata) {
            self.users = jsondata;
        });

    },
    methods: {
        changeManage: function() {
            var element = document.getElementById("accountinfo");
            var element1 = document.getElementById("orders");
            if (element) {
                var display = element.style.display;
                if (display == "none") {
                    element.style.display = "block";
                    element1.style.display = "none";
                }
            }
        },
        changeManage2: function() {
            var element = document.getElementById("orders");
            var element1 = document.getElementById("accountinfo");
            if (element) {
                var display = element.style.display;
                if (display == "none") {
                    element.style.display = "block";
                    element1.style.display = "none";

                }
            }


        },
        toggleEditAccount: function() {
            $("#editAccount").toggle();
            $("#editAccountSubmit").toggle();


        },
        toggleShowOrderProducts: function () {
            $("#ShowProductsContainer").toggle();


        },

        updateAccount: function() {
            var username = document.getElementById("username").value;
            var email = document.getElementById("email").value;
            console.log(username)
            console.log(email)

        },
        deleteUser: function(userID) {
            let data = { "userID": userID }
            $.ajax({
                url: '/admin/deleteUser',
                method: "POST",
                data: data,
                success: () => {
                    var self = this;
                    $.getJSON("/admin/users/", function(jsondata) {
                        console.log(JSON.stringify(jsondata));
                        self.users = jsondata;

                    });
                }
            });
        },
        loadOrders() {
            //Load  questions
            $.ajax({
                url: 'products/getAllOrders',
                type: 'GET',
                success: (data) => {
                   console.log(data)
                  

                },
                error: (data) => {
                    
                }
            });
            //update questions
        },

        updateUser: function() {


        },


    },


});
vm.loadOrders()
