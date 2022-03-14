const vm = new Vue({
    el: "#app",
    data: {
        loggedin: {},
        klarna_obj: {}
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
                    console.log(this.loggedin);




                }
            })
        },

    }

});