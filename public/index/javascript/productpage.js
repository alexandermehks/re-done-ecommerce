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
        values: [0, 5000],
        slide: function(event, ui) {
            $("#amount").val("SEK " + ui.values[0] + " - SEK " + ui.values[1]);

            const minValue = ui.values[0];
            const maxValue = ui.values[1];
            vm.getValueRange(minValue, maxValue)

        }
    });
    $("#slider-range2").slider({
        range: true,
        min: 30,
        max: 49,
        values: [30, 49],
        slide: function(event, ui) {
            $("#shoesize").val("Size " + ui.values[0] + " - Size " + ui.values[1]);

            const minValue = ui.values[0];
            const maxValue = ui.values[1];
            vm.getShoeValueRange(minValue, maxValue)

        }
    });
    $("#amount").val("SEK " + $("#slider-range").slider("values", 0) +
        " - SEK " + $("#slider-range").slider("values", 1));
    $("#shoesize").val("Size " + 30 + " - Size " + 49);

    $(".selector").slider({
        start: function(event, ui) {

        }
    });



    $(function() {
        $("#navbar").load("navbar.html");
    });

    $(function() {
        $("#footer").load("footer.html")
    })

    $(function() {
        $("#productcard").load("productcard.html");
    });

    $(window).scroll(function() {
        if ($(this).scrollTop() > 205) {
            $('#myBtnTop').fadeIn();
        } else {
            $('#myBtnTop').fadeOut();
        }
    }).trigger('scroll');


});

function topFunction() {

    $('html, body').animate({ scrollTop: 0 }, 'slow');
}

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
        choosenCategory: 0,
        choosenShoeSize: "",
        color: {},
        maxValuee: "",
        categories: {},
        shoeMinValue: 30,
        shoeMaxValue: 49

    },
    methods: {

        updateProd: function(e, size) {

            //  this.currentShow.push(this.products[0])
            const buttonValues = e.target.value;
            console.log(e.target.value)
            this.choosenCategory = parseInt(buttonValues);
            this.updateAllFilter()

        },

        updShoeSize(e) {

            let sizeValue = e.target.value;
            this.choosenShoeSize = sizeValue;
            this.updateAllFilter()

        },
        clearAllFilter() {
            this.choosenCategory = 0;
            this.choosenSizes = {
                1: false,
                2: false,
                3: false,
                4: false,
                5: false,
            }
            this.choosenColor = {
                1: false,
                2: false,
                3: false,
                4: false,
            }
            this.choosenShoeSize = ""
            this.updateAllFilter()
        },

        getValueRange(minValue, maxValue) {
            // this.currentShow = []
            this.minValuee = minValue;
            this.maxValuee = maxValue;
            this.updateAllFilter()
        },
        getShoeValueRange(minValue, maxValue) {
            // this.currentShow = []
            this.shoeMinValue = minValue;
            this.shoeMaxValue = maxValue;
            this.updateAllFilter()
        },


        updateAllFilter() {
            this.currentShow = []
            const allProd = !this.choosenSizes[1] && !this.choosenSizes[2] && !this.choosenSizes[3] && !this.choosenSizes[4] && !this.choosenSizes[5];
            const allColor = !this.choosenColor[1] && !this.choosenColor[2] && !this.choosenColor[3] && !this.choosenColor[4] && !this.choosenColor[5];
            for (var i = 0; i < this.products.length; i++) {
                let product = this.products[i]
                console.log(this.maxValuee)
                if (product.categoryObject.catID === this.choosenCategory || product.categoryObject.parentCategory === this.choosenCategory || this.choosenCategory === 0) {
                    // console.log(this.choosenShoeSize)

                    if (product.size >= this.shoeMinValue && product.size <= this.shoeMaxValue || this.getParentCategory(product.catID) != 1) {

                        if (this.choosenSizes[product.size] || allProd || this.getParentCategory(product.catID) == 1) {

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

        newsMail() {
            const email = document.getElementById("emailN").value
            let obj = {
                "email": email
            }
            $.ajax({
                url: "user/postEmail",
                type: 'POST',
                data: obj,
                success: (result) => {
                    //  console.log(result)
                }
            })

        },


        viewProduct(id) {
            window.location.href = "/singleproduct?id=" + id

        },


        addToShoppingCart() {
            alert("Functionality not yet created")
        },

        getAllCategories() {
            $.ajax({
                url: '/products/allCategories',
                type: 'GET',
                success: (result) => {
                    this.categories = result;

                    let res = []

                    for (let i in result) {
                        let cat = result[i];
                        cat.htmltext = cat.category_name
                        res.push(cat)
                        for (let c in cat.sub) {
                            let cat2 = cat.sub[c];
                            cat2.htmltext = "- &nbsp;&nbsp;&nbsp;&nbsp;" + cat2.category_name
                            res.push(cat2);
                        }
                    }
                    this.categories = res;

                    let catID = new URL(location.href).searchParams.get('catID')

                    if (catID) {
                        let cID = parseInt(catID)
                        if (!isNaN(catID)) {
                            console.log("here?", catID)
                            for (i in this.categories) {
                                let category = this.categories[i];
                                if (category.catID == cID) {
                                    console.log("HERE? :(")
                                    this.choosenCategory = cID
                                    break;
                                }
                            }
                        }
                    }



                }
            })
        },
        getParentCategory(catID) {
            for (i in this.categories) {
                let category = this.categories[i];
                if (category.catID == catID)
                    return category.parentCategory;
            }
            return 0
        },
        getColors() {
            $.ajax({
                url: '/products/allColors',
                type: 'GET',
                success: (result) => {
                    this.productColor = result;
                }
            })
        },




    },


    mounted() {
        //method to get all products
        var self = this;
        this.getAllCategories();
        this.getColors();




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