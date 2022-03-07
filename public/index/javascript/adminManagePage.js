const vm = new Vue({
    el: "#app",
    data: {
        testAccount: "luca123"

    },

    mounted() {
        $(function() {
            $("#navbar").load("navbar.html");
            $("#footer").load("footer.html");
        });


    },
    methods: {
        changeManage: function() {
            $("#accountinfo").toggle();
            $("#orders").toggle();

        },
        toggleEditAccount: function() {
            $("#editAccount").toggle();
            $("#editAccountSubmit").toggle();

            
        },

        updateAccount: function() {
            var username = document.getElementById("username").value;
            var email = document.getElementById("email").value;
            console.log(username)
            console.log(email)


            
        }

       
    }

});