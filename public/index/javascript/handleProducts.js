const vm = new Vue({
    el: "#app",
    data: {
        products: [],
        bajs: 'hehe',
        onlyProducts: [],
        currentProduct: {},
        currentProperty: {},
        handleProduct: {},
        colors: {},
        productWithPropertiesByIdAndColor: {},
        productSizes: {
            1: "S",
            2: "M",
            3: "L",
            4: "XL",
            5: "XXL",
        },
        shoeSizes: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49]

    },

    mounted() {
        $("#navbar").load("navbar.html");
        $("#footer").load("footer.html");
        this.updateAll();
        this.getColors();
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
        getOnlyProducts() {
            $.ajax({
                url: '/products/allOnlyProduct',
                type: 'GET',
                success: (result) => {

                    //console.log(result)
                    this.onlyProducts = result;
                    if (this.onlyProducts.length > 0) {
                        this.currentProduct = this.onlyProducts[0];
                    }
                }
            })

        },
        getAllProductsWithPropertiesByIdAndColor() {
            //products/getAllProductsWithPropertiesByIdAndColor
            $.ajax({
                url: '/products/getAllProductsWithPropertiesByIdAndColor',
                type: 'GET',
                success: (result) => {

                    //console.log(result)
                    this.productWithPropertiesByIdAndColor = result;
                }
            })
        },
        getInnerForLoop(prodID, colorID) {
            if (prodID != undefined && colorID != undefined) {
                //console.log(prodID, colorID)
                let val = this.productWithPropertiesByIdAndColor[prodID][colorID]
                return val;
            }
            return {}


        },
        getProductPropertiesByProdAndColorID(prodID, colorID, type) {
            //products/getProductPropertiesByProdAndColorID

            const data = {
                "prodID": prodID,
                "colorID": colorID,
                "type": type
            }

            $.ajax({
                url: '/products/getProductPropertiesByProdAndColorID',
                method: "POST",
                data: data,
                success: function(response) {
                    console.log("get shit")
                    console.log(response)
                        //this.updateAll()
                    $("#addProductOverlay").fadeOut();
                }.bind(this),
                error: function() {
                    console.log("error")
                }.bind(this)

            });



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
        deleteProductById(prodID) {
            let data = { "prodID": prodID }
            $.ajax({
                url: '/products/deleteProduct',
                method: "DELETE",
                data: data,
                success: function(response) {
                    this.handleProduct = {}
                    this.updateAll()
                    $("#editProductOverlay").fadeOut();
                    $("#confirm-remove-product").fadeOut();
                }.bind(this),
                error: function() {
                    console.log("error")
                }.bind(this)

            });
        },
        deleteProperty(property) {
            console.log(property)
            let data = { "propID": property.propID, "type": property.type }
            console.log(data)
            $.ajax({
                url: '/products/deleteProperty',
                method: "DELETE",
                data: data,
                success: function(response) {
                    this.currentProperty = {}
                    this.updateAll()
                    $("#confirm-remove-property").fadeOut();
                }.bind(this),
                error: function() {
                    console.log("error")
                }.bind(this)

            });
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
            this.getProducts()
            this.getOnlyProducts()
            this.getAllProductsWithPropertiesByIdAndColor()
        },
        getFormValues(submitEvent) {
            console.log(submitEvent.target.elements)
            const name = submitEvent.target.elements["productName"].value;
            const type = submitEvent.target.elements["productType"].value;
            const price = submitEvent.target.elements["productPrice"].value;
            const desc = submitEvent.target.elements["productDescription"].value;
            const spec = submitEvent.target.elements["productSpecification"].value;

            //Add images
            let image = document.getElementById("file").files;
            let images = new FormData();
            for (let i = 0; i < image.length; i++) {
                images.append("file", image[i])
            }

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
                    console.log("Add images")
                    images.append('id', response)
                    $.ajax({
                        url: '/products/uploadpicture',
                        data: images,
                        method: "POST",
                        processData: false,
                        contentType: false,
                        success: (result) => {
                            console.log(result)
                            this.updateAll()
                            $("#addProductOverlay").fadeOut();
                        }
                    })



                }.bind(this),
                error: function() {
                    console.log("error")
                }.bind(this)

            });


        },

        getFormValuesEdit(submitEvent) {
            //products/getProductPropertiesByProdAndColorID
            console.log(submitEvent.target.elements)
            const prodID = submitEvent.target.elements["productProdID"].value;
            const name = submitEvent.target.elements["productNameEdit"].value;
            const type = submitEvent.target.elements["productTypeEdit"].value;
            const price = submitEvent.target.elements["productPriceEdit"].value;
            const desc = submitEvent.target.elements["productDescriptionEdit"].value;
            const spec = submitEvent.target.elements["productSpecificationEdit"].value;

            console.log(name, type, price, desc, spec)
            const data = {
                "prodID": prodID,
                "name": name,
                "type": type,
                "price": price,
                "description": desc,
                "specification": spec
            }

            console.log("Edit", data)
            $.ajax({
                url: '/products/edit',
                method: "PUT",
                data: data,
                success: function(response) {
                    console.log("Product was edited")
                    console.log(response)
                    this.updateAll()

                    //Update handle product as well without db call
                    this.handleProduct.name = name;
                    this.handleProduct.price = price;
                    this.handleProduct.description = desc;
                    this.handleProduct.specification = spec;
                    //$("#editProductOverlay").fadeOut();
                }.bind(this),
                error: function() {
                    console.log("error")
                }.bind(this)

            });

        },
        getFormValuesProperty(submitEvent) {
            //products/getProductPropertiesByProdAndColorID
            let prodID = submitEvent.target.elements.propertyProdID;
            let type = submitEvent.target.elements.propertyType;
            let color = submitEvent.target.elements.color;
            let propertyBalance = submitEvent.target.elements.propertyBalance;
            let propertySize = submitEvent.target.elements.propertySize;
            let url = "https://www.komplett.se/img/p/200/1182209.jpg"

            const data = {
                "prodID": prodID.value,
                "type": type.value,
                "colorID": color.value,
                "balance": propertyBalance.value,
                "size": propertySize.value,
                "picURL": url
            }
            $.ajax({
                url: '/products/addProperty',
                method: "POST",
                data: data,
                success: function(response) {
                    this.updateAll();
                }.bind(this),
                error: function() {
                    console.log("error")
                }.bind(this)

            });


        },
        clickHandle(product) {
            this.handleProduct = product;
            $("#editProductOverlay").fadeIn();





        },
        getColors() {
            $.ajax({
                url: '/products/allColors',
                type: 'GET',
                success: (result) => {
                    this.colors = result;
                }
            })
        },
        removeProperty(property) {
            this.currentProperty = property;
            $("#confirm-remove-property").fadeIn();
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


    $("#closeHandleProduct").click(function() {
        console.log("table")
        $("#editProductOverlay").fadeOut();
    });

    $("#dismissRemoveProduct").click(function() {
        $("#confirm-remove-product").fadeOut();
    });

    $("#confirmRemoveProduct").click(function() {
        handleProduct = vm.handleProduct;
        if (handleProduct.prodID) {
            console.log("Ready to remove product", handleProduct.prodID)
                //Post request remove product
            vm.deleteProductById(handleProduct.prodID)



        } else {
            console.log("No product is choosen")
        }
    });

    $("#dismissRemoveProperty").click(function() {
        $("#confirm-remove-property").fadeOut();
    });

    $("#confirmRemoveProperty").click(function() {
        console.log("Ready to remove property")
            //currentPropertyId
        if (vm.currentProperty.propID) {
            vm.deleteProperty(vm.currentProperty)
        } else {
            console.log("No property choosen")
        }


    });

    $(".removeProductButton").click(function() {
        $("#confirm-remove-product").fadeIn();
    });





});