$(document).ready(function () {


    $("#reviewbutton").click(
        function () {
            $(".reviewform").slideToggle();

        });




});

function emptysizes() {
    document.getElementById('S').setAttribute("class", "style1");
}

function changeStarColor(id) {
    document.getElementById(id).style.color = "orange";
}





$(function () {
    $("#navbar").load("navbar.html");
});

const vm = new Vue({

    el: "#app",
    data: {
        product: [],
        prodname: "",
        sizes: [],
        order: [{
            "prodID": "None",
            "propID": "None",


        }],
    },

    methods: {
        loadProduct(id) {
            //Load  questions
            $.ajax({
                url: 'products/byProdId/' + id,
                type: 'GET',
                success: (data) => {
                    this.product = data
                    this.prodname = data[0].name
                    this.order.prodID = data[0].prodID

                    for (var i = 0; i < data.length; i++) {

                        if (data[i].balance === data[0].balance) {
                            if (jQuery.inArray(data[i].size, this.sizes) != -1) {

                            } else {
                                this.sizes.push(data[i].size)
                            }

                        }
                    }

                    this.sizes.sort();


                },
                error: (data) => {
                    console.log("AAA")
                    return null
                }
            });

            //update questions
        },



        updatePicturePick: function (id) {

            $('#' + id).css({
                'border': '1px solid black'
            });

        },
        updateSizePick: function (id, products) {
            for (var i = 0; i < products.length; i++) {
                $('#' + products[i].propID + "1").css({
                    'background-color': 'white'
                });
            }
            $('#' + id + "1").css({
                'background-color': 'lightgrey'
            });


        },
        updatePicture: function (url) {
            $("#picbig").attr('src', url);
            

        },
        updatePictureColor: function (url) {
            $("#picbig").attr('src', url);
            for (var i = 0; i < this.product.length; i++) {
                console.log(this.product[i].size)
                $('#' + this.product[i].size).css({
                    'background-color': 'white'
                });
                
            }

        },
        changeColor: function(id) {
            for (var i = 0; i < this.product.length; i++) {
                console.log(this.product[i].size)
                $('#' + this.product[i].size).css({
                    'background-color': 'white'
                });
                
            }
            $('#' + id).css({
                'background-color': 'lightgrey'
            });
            
        },
        updateCorrectSizes: function (colorID) {
            this.sizes = []


            for (var i = 0; i < this.product.length; i++) {
                if (this.product[i].balance === colorID) {
                    if (jQuery.inArray(this.product[i].size, this.sizes)) {
                        this.sizes.push(this.product[i].size)
                    } else {
                        this.sizes.push(this.product[i].size)
                    }

                }
            }

            this.sizes.sort();
            $("#sizecontainer").load(window.location.href + " #sizecontainer");

        },

    }



});
vm.loadProduct("id1")

