const vm = new Vue({
    el: "#app",
    data: {
        products: [],
        bajs: 'hehe',
        onlyProducts: [],
        currentProduct: {}
    },



    mounted() {
        $("#navbar").load("navbar.html");
        $("#footer").load("footer.html");
        this.updateAll();
    },

    methods: {
        do_test() {
            console.log("test")
        },
        getProducts() {
            $.ajax({
                url: '/products/all',
                type: 'GET',
                success: (result) => {

                    console.log(result)
                    this.products = result;
                    this.getProductPropertiesByProduct();
                }
            })
        },

        getOnlyProducts() {
            $.ajax({
                url: '/products/allOnlyProduct',
                type: 'GET',
                success: (result) => {

                    console.log(result)
                    this.onlyProducts = result;
                    if (this.onlyProducts.length > 0) {
                        this.currentProduct = this.onlyProducts[0];
                    }
                }
            })

        },
        getProductPropertiesByProduct() {
            res = {};
            for (const i in this.products) {
                const product = this.products[i];
                if (product.prodID in res) {
                    res[product.prodID].push(product)
                } else {
                    res[product.prodID] = [product]
                }


            }
            this.productsObj = res;


        },
        getProductPropertiesByProductId(id) {

            if (id in this.productsObj) {
                console.log("____")
                console.log(this.productsObj[id])
                return this.productsObj[id];
            } else {
                return []
            }
        },
        updateAll() {
            this.getOnlyProducts()
        },
        getFormValues(submitEvent) {
            console.log("BAJS")
            console.log(submitEvent.target.elements)
            const name = submitEvent.target.elements["productName"].value;
            const type = submitEvent.target.elements["productType"].value;
            const price = submitEvent.target.elements["productPrice"].value;
            const desc = submitEvent.target.elements["productDescription"].value;
            const spec = submitEvent.target.elements["productSpecification"].value;

            console.log(name, type, price, desc, spec)
            const data = {
                "name": name,
                "type": type,
                "price": price,
                "description": desc,
                "specification": spec
            }

            $.ajax({
                url: '/products/add',
                method: "POST",
                data: data,
                success: function(response) {
                    console.log("Product was added :D")
                    console.log(response)
                    this.updateAll()
                    $("#addProductOverlay").fadeOut();
                }.bind(this),
                error: function() {
                    console.log("error")
                }.bind(this)

            });


        }





    }
})


$(document).ready(function() {

    //#addProductOverlay
    $("#openAddNew").click(function() {
        $("#addProductOverlay").fadeIn();
    });

    $("#closeAddProduct").click(function() {
        $("#addProductOverlay").fadeOut();
    });



});