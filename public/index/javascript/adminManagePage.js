const vm = new Vue({
    el: "#app",
    data: {
        testAccount: "luca123",
        users: [],
        orders: [],
        order_filter: "All", // All, Recieved, Packing, Delivered 
        loggedin: {}

    },

    mounted() {
        $(function() {
            $("#navbar").load("navbar.html");
            $("#footer").load("footer.html");
        });
        this.loadUsers()
        this.getLoggedInUser();
    },
    methods: {
        getLoggedInUser() {
            $.ajax({
                url: '/auth/loggedInUser',
                type: 'GET',
                success: (result) => {
                    this.loggedin = result;
                }
            })
        },
        changeOrderFilter(filter) {
            this.order_filter = filter;
        },
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

        updateAccount: function(userID, name, email, role, password) {
            let nam, ema, rol, pwd;
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
            if ($('password' + userID).val() === "") {
                pwd = password;
            } else {
                pwd = $('#password' + userID).val()
            }

            let data = {
                "userID": userID,
                "name": nam,
                "email": ema,
                "role": rol,
                "password": pwd,
            }
            $.ajax({
                url: '/admin/editUser',
                method: "PUT",
                data: data,
                success: () => {
                    $.getJSON("/admin/users/", function(jsondata) {
                        //  console.log(jsondata)
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



                },
                error: (data) => {
                    console.log(data)

                }
            });
            //update questions
        },
        deleteOrder(orderID) {

            let data = { "orderID": orderID }
            $.ajax({
                url: '/products/deleteOrder',
                method: "DELETE",
                data: data,
                success: () => {

                    $.getJSON("products/getAllOrders", function(jsondata) {
                        // console.log(JSON.stringify(jsondata));
                        this.orders = jsondata;

                    }.bind(this));
                }
            });
        },


        updateOrderStatus(orderID) {
            var t = document.querySelector('input[name="inlineRadioOptions"]:checked').value;


            let data = {
                "orderID": orderID,
                "status": t,
            }
            $.ajax({
                url: '/products/editOrderStatus',
                method: "PUT",
                data: data,
                success: () => {
                    $.getJSON("products/getAllOrders", function(jsondata) {
                        // console.log(JSON.stringify(jsondata));
                        this.orders = jsondata;

                    }.bind(this));

                }
            });

        },


    },


});
vm.loadOrders()