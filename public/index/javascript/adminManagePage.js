const vm = new Vue({
    el: "#app",
    data: {
        testAccount: "luca123"

    },

    mounted() {
        $(function () {
            $("#navbar").load("navbar.html");
            $("#footer").load("footer.html");
        });


    },
    methods: {
        changeManage: function () {
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
        changeManage2: function () {
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
        toggleEditAccount: function () {
            $("#editAccount").toggle();
            $("#editAccountSubmit").toggle();


        },
        toggleShowOrderProducts: function () {
            $("#ShowProductsContainer").toggle();


        },

        updateAccount: function () {
            var username = document.getElementById("username").value;
            var email = document.getElementById("email").value;
            console.log(username)
            console.log(email)



        }


    }

});