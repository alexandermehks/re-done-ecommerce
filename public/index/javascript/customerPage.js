const vm = new Vue({
    el: "#app",
    data: {
        test: "luca"

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