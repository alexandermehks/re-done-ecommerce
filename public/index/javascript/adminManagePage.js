const vm = new Vue({
    el: "#app",
    data: {
        testAccount: "luca123",
        users: [],
        orders: [],

    },

    mounted() {
        $(function() {
            $("#navbar").load("navbar.html");
            $("#footer").load("footer.html");
        });
        this.loadUsers()

    },
    methods: {

        loadUsers() {
            $.ajax({
                url: 'admin/users/',
                type: 'GET',
                success: (data) => {
                    this.users = data;
                    console.log(data)

                },
                error: (data) => {
                    console.log(data)

                }
            });

        },
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
        toggleEditAccount: function(userID) {
            $('#form' + userID).toggle();
            $('#formsub' + userID).toggle();
        },
        toggleShowOrderProducts: function() {
            $("#ShowProductsContainer").toggle();


        },

        updateAccount: function(userID, name, email, role) {
            let nam, ema, rol;
            if ($('#role' + userID).val() === "") {
                rol = role;
            } else {
                rol = $('#role' + userID).val()
            }
            if ($('#email' + userID).val() === "") {
                ema = email;
            } else {
                ema = $('#email' + userID).val()
            }
            if ($('#name' + userID).val() === "") {
                nam = name;
            } else {
                nam = $('#name' + userID).val()
            }
            let data = {
                "userID": userID,
                "name": nam,
                "email": ema,
                "role": rol,
            }
            $.ajax({
                url: '/admin/editUser',
                method: "PUT",
                data: data,
                success: () => {
                    $.getJSON("/admin/users/", function(jsondata) {
                        console.log(jsondata)
                        this.users = jsondata;
                        this.toggleEditAccount(userID)

                    }.bind(this));


                }
            });

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
                    this.orders = data;
                    console.log("bajs", orders)


                },
                error: (data) => {
                    console.log(data)

                }
            });
            //update questions
        },

        updateUser: function() {


        },


    },


});
vm.loadOrders()