const vm = new Vue({
    el: "#app",
    data: {
        onlyProducts: []

    },



    mounted() {
        $(function() {
            $("#navbar").load("navbar.html");
            $("#footer").load("footer.html");
        });
        this.getOnlyProducts()

    },
    methods: {
        do_test() {
            console.log("test")
        },
        getOnlyProducts() {
            $.ajax({
                url: '/products/allOnlyProduct',
                type: 'GET',
                success: (result) => {
                    console.log("Okey we add?")
                        //console.log(result)
                    this.onlyProducts = result;
                    for (let i in this.onlyProducts) {
                        this.onlyProducts[i].tagsArray = this.tagStringToArray(this.onlyProducts[i].tags)
                    }



                }
            })

        },
        tagStringToArray(tag) {
            if (tag)
                return tag.split(',')
            return []
        }

























    }
});