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
       
    }

});