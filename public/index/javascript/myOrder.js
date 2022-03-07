const vm = new Vue({
    el: "#app",
    data: {
        testAccount: "luca123",
        order: ["asd", "asd"]

    },

    mounted() {
        $(function() {
            $("#navbar").load("navbar.html");
            $("#footer").load("footer.html");
        });


    },
    methods: {
        do_test() {
            console.log("test")
        },

    }

});