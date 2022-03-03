$(document).ready(function() {


    $("#filter-dropdown").click(
        function() {
            $(".filters").slideToggle();

        });


    /*
        $('.color').click(function() {
            $(this).toggleClass('active');

        });

    */
    $("#slider-range").slider({
        range: true,
        min: 0,
        max: 5000,
        values: [0, 3000],
        slide: function(event, ui) {
            $("#amount").val("SEK " + ui.values[0] + " - SEK " + ui.values[1]);

            const minValue = ui.values[0];
            const maxValue = ui.values[1];
            vm.getValueRange(minValue, maxValue)

        }
    });
    $("#amount").val("SEK " + $("#slider-range").slider("values", 0) +
        " - SEK " + $("#slider-range").slider("values", 1));


    $(".selector").slider({
        start: function(event, ui) {

        }
    });

    console.log();


    $(function() {
        $("#navbar").load("navbar.html");
    });

    $(function() {
        $("#footer").load("footer.html")
    })

    $(function() {
        $("#productcard").load("productcard.html");
    });


});
/*
$(document).ready(function() {
    // Handler for .ready() called.
    $("#category").change(function() {

        let val = $(this).val();
        //  console.log(val)

    });
});*/

const vm = new Vue({
    el: "#appee",
    data: {
        products: [],
        productC: [],
        ProductsType: [],
        productss: [],
        currentShow: [],
        productSizes: {
            1: "S",
            2: "M",
            3: "L",
            4: "XL",
            5: "XXL",
        },
        shoeSizes: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49],
        choosenSizes: {
            1: false,
            2: false,
            3: false,
            4: false,
            5: false,
        },
        productColor: {
            1: "#f0f1f2",
            2: "#000000",
            3: "#4040b9",
            4: "#5dad3742",
        },
        choosenColor: {
            1: false,
            2: false,
            3: false,
            4: false,
        },
        choosenCategory: "",
        choosenShoeSize: "",
        color: {},
        maxValuee: "",

    },
    methods: {

        updateProd: function(e, size) {

            //  this.currentShow.push(this.products[0])
            const buttonValues = e.target.value;
            this.choosenCategory = buttonValues;
            this.updateAllFilter()

        },

        updShoeSize(e) {

            let sizeValue = e.target.value;
            this.choosenShoeSize = sizeValue;
            this.updateAllFilter()

        },
        clearAllFilter() {
            location.reload()

        },

        getValueRange(minValue, maxValue) {
            // this.currentShow = []
            this.minValuee = minValue;
            this.maxValuee = maxValue;
            this.updateAllFilter()
                //  const products = this.products;
                // for (let i = 0; i < products.length; i++) {
                //     if (products[i].price > minValue && products[i].price < maxValue) {
                //    this.currentShow.push(products[i])
                //Lägger till där det ska visas
                //  }
                //   }
        },



        updateAllFilter() {
            this.currentShow = []
            const allProd = !this.choosenSizes[1] && !this.choosenSizes[2] && !this.choosenSizes[3] && !this.choosenSizes[4] && !this.choosenSizes[5];
            const allColor = !this.choosenColor[1] && !this.choosenColor[2] && !this.choosenColor[3] && !this.choosenColor[4];
            for (var i = 0; i < this.products.length; i++) {
                let product = this.products[i]
                console.log(this.maxValuee)
                if (product.type === this.choosenCategory || this.choosenCategory === "") {
                    // console.log(this.choosenShoeSize)

                    if (product.size.toString() === this.choosenShoeSize.toString() || this.choosenShoeSize === "") {

                        if (this.choosenSizes[product.size] || allProd) {

                            if (this.choosenColor[product.colorID] || allColor) {

                                if (product.price > this.minValuee && product.price < this.maxValuee || this.maxValuee === "") {
                                    // console.log(minValue)
                                    //console.log(product)
                                    this.currentShow.push(product)
                                }
                            }

                        }

                    }
                }

            }

            //  $("#productUpd").load(window.location.href + " #productUpd");

        },
        updColorFilter(color) {
            this.choosenColor[color] = !this.choosenColor[color]
            this.updateAllFilter()
                //  console.log(this.choosenColor[color])
        },

        updSizeFilter(size) {
            this.choosenSizes[size] = !this.choosenSizes[size]
            this.updateAllFilter()

            //  console.log()
        },

        getSingle(id) {

            $.ajax({
                url: "products/singleProduct/" + id,
                type: 'GET',
                success: (result) => {
                    console.log(result)
                }
            })
        },


        viewProduct(id){
            window.location.href = "/singleproduct?id=" + id

        },
          


    },

    mounted() {
        //method to get all products
        var self = this;
        $.getJSON("products/all/", function(jsondata) {
            //  console.log(JSON.stringify(jsondata));

            let filter = {}

            for (i in jsondata) {
                let prod = jsondata[i];
                if (!(filter.hasOwnProperty(prod.prodID))) {
                    filter[prod.prodID] = []
                }


                if (filter[prod.prodID].length == 0) {
                    filter[prod.prodID].push(prod)
                } else {
                    let found = false;
                    for (j in filter[prod.prodID]) {
                        let prod2 = filter[prod.prodID][j];
                        //  console.log(prod2)
                        if (prod.colorID === prod2.colorID) {
                            found = true;
                            break;
                        }
                    }
                    if (!found)
                        filter[prod.prodID].push(prod)
                }
            }


            let res = []
            for (id in filter) {
                for (id2 in filter[id]) {
                    let prod = filter[id][id2];
                    //    console.log(prod.prodID, prod.colorID)
                    res.push(prod)
                }
            }


            self.products = res;
            this.updateAllFilter()
                // console.log(this.currentShow)


        }.bind(this));
    }



});