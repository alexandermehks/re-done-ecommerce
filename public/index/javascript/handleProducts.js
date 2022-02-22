const vm = new Vue({
    el: "#app",
    data: {
        products: [],
        bajs: 'hehe',
        onlyProducts: [],
        currentProduct: {},
        currentProperty: {},
        currentPicture: {},
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

                    for (let i in this.onlyProducts) {
                        let product = this.onlyProducts[i];
                        if (product.prodID == this.handleProduct.prodID) {
                            this.handleProduct = product;
                            break;
                        }
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



            this.updateDomPictures();


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
        getFormValuesAddNewPictures(submitEvent) {
            //Add images
            let image = document.getElementById("fileAddNew").files;
            let images = new FormData();
            for (let i = 0; i < image.length; i++) {
                images.append("file", image[i])
            }
            images.append('id', this.handleProduct.prodID)

            $.ajax({
                url: '/products/uploadpicture',
                data: images,
                method: "POST",
                processData: false,
                contentType: false,
                success: (result) => {
                    console.log(result)
                    this.updateAll()
                        //Update Handle product?
                        //$("#addProductOverlay").fadeOut();
                }
            })


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
                    this.updateDomPictures();
                    //$("#editProductOverlay").fadeOut();
                }.bind(this),
                error: function() {
                    console.log("error")
                }.bind(this)

            });

        },
        getFormValuesProperty(submitEvent) {
            //products/getProductPropertiesByProdAndColorID

            console.log(submitEvent)

            let prodID = submitEvent.target.elements.propertyProdID;
            let type = submitEvent.target.elements.propertyType;
            let color = submitEvent.target.elements.color;
            let propertyBalance = submitEvent.target.elements.propertyBalance;
            let propertySize = submitEvent.target.elements.propertySize;
            let url = "https://www.komplett.se/img/p/200/1182209.jpg"


            let image = document.getElementById("fileProperty").files;
            let formData = new FormData();
            for (let i = 0; i < image.length; i++) {
                formData.append("file", image[i])
            }

            const data = {
                "prodID": prodID.value,
                "type": type.value,
                "colorID": color.value,
                "balance": propertyBalance.value,
                "size": propertySize.value,
                "picURL": url,
            }

            //MAGIC
            const json = JSON.stringify(data);
            const blob = new Blob([json], {
                type: 'application/json'
            });
            formData.append('data', JSON.stringify(data))

            $.ajax({
                url: '/products/addProperty',
                method: "POST",
                contentType: false,
                processData: false,
                cache: false,
                data: formData,
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

            $("#editProductOverlay").fadeIn(function() {
                console.log("We are faded in")
                this.updateDomPictures();
            }.bind(this));





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
        },
        removeImage(picture) {
            this.currentPicture = picture;
            $("#confirm-remove-picture").fadeIn();
        },
        fadeOutPictureConfirmRemove() {
            $("#confirm-remove-picture").fadeOut();
        },
        confirmRemovePicture(picture) {

            $.ajax({
                url: '/products/deletePicture',
                method: "DELETE",
                data: picture,
                success: function(response) {
                    this.currentPicture = {}
                    this.updateAll()

                    //Loop through handle product and remove img as well
                    for (i in this.handleProduct.pictures) {
                        if (this.handleProduct.pictures[i].picID == picture.picID) {
                            this.handleProduct.pictures.splice(i, 1)
                            break;
                        }
                    }


                    $("#confirm-remove-picture").fadeOut();
                }.bind(this),
                error: function() {
                    console.log("error")
                }.bind(this)

            });
        },
        updateDomPictures() {
            updateDomPic()

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






function handleDragStart(e) {
    this.style.opacity = '0.4';
    dragSrcEl = this;

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragEnd(e) {
    this.style.opacity = '1';

    items = getItems()
    items.forEach(function(item) {
        item.classList.remove('over');
    });
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }

    return false;
}

function handleDragEnter(e) {
    this.classList.add('over');
}

function handleDragLeave(e) {
    this.classList.remove('over');
}

function handleDrop(e) {
    e.stopPropagation();

    if (dragSrcEl !== this) {
        console.log("src", dragSrcEl)
        console.log("end", this)


        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = e.dataTransfer.getData('text/html');
    }

    return false;
}


function getItems() {
    return document.querySelectorAll('.drag-container .draggable-box');
}


function updateDomPic() {
    console.log("Dom updated")
    items = getItems()
    items.forEach(function(item) {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('dragenter', handleDragEnter);
        item.addEventListener('dragleave', handleDragLeave);
        item.addEventListener('dragend', handleDragEnd);
        item.addEventListener('drop', handleDrop);
    });
}