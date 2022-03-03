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
        getProductsByCategory(parentCategories, limit) {
            //Example tags = [1,7];
            let res = []
            for (let i in this.onlyProducts) {
                let product = this.onlyProducts[i];
                if (parentCategories.includes(product.categoryObject.parentCategory)) {
                    res.push(product)
                }
            }
            if (res.length > limit)
                res = res.splice(0, limit)

            return res;

        },
        getProductsBytags(tags, limit) {
            //Example tags = [1,7];
            let res = []
            for (let i in this.onlyProducts) {
                let product = this.onlyProducts[i];
                const sharesElement = tags.some(r => product.tagsArray.indexOf(r) >= 0);
                if (sharesElement) {
                    res.push(product)
                }
            }
            if (res.length > limit)
                res = res.splice(0, limit)

            return res;

        },
        tagStringToArray(tag) {
            if (tag)
                return tag.split(',')
            return []
        }













    }
});

//.campaign-bg-bracelet
//campaign-1-inner-top

$(document).ready(function() {

    $(".campaign-bg-bracelet").height($(".campaign-1-inner-top").height());
    $(".campaign-bg-bracelet").width($(".campaign-1-inner-top").width());

    $(".campaign-bg-sunglass").height($(".inner1").height());
    $(".campaign-bg-sunglass").width($(".inner1").width());

    $(".campaign-bg-fedora").height($(".inner2").height());
    $(".campaign-bg-fedora").width($(".inner2").width());


});