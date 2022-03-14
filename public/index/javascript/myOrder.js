const vm = new Vue({
    el: "#app",
    data: {
        testAccount: "luca123",
        order: ["asd", "asd"],
        loggedin: {},
        orders: []

    },

    mounted() {
        $(function() {
            $("#navbar").load("navbar.html");
            $("#footer").load("footer.html");
        });


        this.getLoggedInUser();

    },
    methods: {
        do_test() {
            console.log("test")
        },
        getLoggedInUser() {
            $.ajax({
                url: '/auth/loggedInUser',
                type: 'GET',
                success: (result) => {
                    this.loggedin = result;
                    this.getOrdersByUserID(this.loggedin.id)
                }
            })
        },
        getOrdersByUserID(userID) {
            const dat = {
                "userID": userID
            }
            const email = {
                "email": this.loggedin.email
            }
            $.ajax({
                url: '/products/getOrdersByUserID',
                type: 'POST',
                data: email,
                success: (result) => {
                    this.orders = result;

                    for (i in this.orders)
                        console.log(this.orders[i]);

                }
            })
        },

    }

});