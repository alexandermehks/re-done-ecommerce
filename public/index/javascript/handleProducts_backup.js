const vm = new Vue({
     el: "#app",
     data: {
          products: [],
          bajs: 'hehe',
          onlyProducts: [],
          currentProduct: {},
          handleProduct: {}
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
               console.log(submitEvent.target.elements)
               var image = document.getElementById("file").files;
               let images = new FormData();
               for (let i = 0; i < image.length; i++) {
                    images.append("file", image[i])
               }






               console.log("FUNKAR FORTFARANDE")
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
                    "specification": spec,

               }

               $.ajax({
                    url: '/products/add',
                    data: data,
                    method: "POST",
                    success: function (response) {
                         images.append('id', response)
                         $.ajax({
                              url: '/products/uploadpicture',
                              data: images,
                              method: "POST",
                              processData: false,
                              contentType: false,
                              success: (result) => {

                              }
                         })
                         console.log("Product was added :D")
                         console.log(response)
                         this.updateAll()
                         $("#addProductOverlay").fadeOut();
                    }.bind(this),
                    error: function () {
                         console.log("error")
                    }.bind(this)

               });


          },
          getFormValuesEdit(submitEvent) {
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
                    success: function (response) {
                         console.log("Product was edited")
                         console.log(response)
                         this.updateAll()
                         $("#editProductOverlay").fadeOut();
                    }.bind(this),
                    error: function () {
                         console.log("error")
                    }.bind(this)

               });

          },
          clickHandle(product) {
               this.handleProduct = product;
               $("#editProductOverlay").fadeIn();





          },





     }
})


$(document).ready(function () {

     //#addProductOverlay
     $("#openAddNew").click(function () {
          $("#addProductOverlay").fadeIn();
     });

     $("#closeAddProduct").click(function () {
          $("#addProductOverlay").fadeOut();
     });


     $("#closeHandleProduct").click(function () {
          console.log("table")
          $("#editProductOverlay").fadeOut();
     });



});