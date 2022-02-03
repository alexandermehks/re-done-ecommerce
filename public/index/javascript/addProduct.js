const vm = new Vue({
    el: "#app",
    data: {
        products: [],
        onlyProducts: [],
        currentProduct: {},
        productsObj: {},
        msg: 'aasd',
        msg2: 'asd2',
        title: "Alex webpage",
        posts: [
            { id: 1, title: 'My journey with Vue' },
            { id: 2, title: 'Blogging with Vue' },
            { id: 3, title: 'Why Vue is so fun' },
            { id: 3, title: 'HELO ALEX' }
        ]
    },

    mounted() {
        this.updateAll()

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
        setChoosenProduct(prodID) {
            for (const product in this.onlyProducts) {
                if (this.onlyProducts[product].prodID == prodID) {
                    this.currentProduct = this.onlyProducts[product];
                    break;
                }
            }
        },
        updateAll() {
            this.getProducts();
            this.getOnlyProducts();
        },
        getFormValues(submitEvent) {
            console.log("BAJS")
            const type = submitEvent.target.elements["type"].value
            const prodID = submitEvent.target.elements["prodID"].value
            const color = submitEvent.target.elements["color"].value
            const balance = submitEvent.target.elements["balance"].value
            const size = submitEvent.target.elements["size"].value
            const url = submitEvent.target.elements["url"].value

            console.log(type, prodID, color, balance, size, url)
            const data = {
                "prodID": prodID,
                "type": type,
                "colorID": color,
                "balance": balance,
                "size": size,
                "picURL": url
            }
            $.ajax({
                url: '/products/addProperty',
                method: "POST",
                data: data,
                success: function(response) {
                    this.updateAll();
                },
                error: function() {
                    console.log("error")
                }

            });
        },
        clickShowMore(id) {
            console.log(id)
            $(id).toggle();
        }


    }
})

$(document).ready(function() {




});