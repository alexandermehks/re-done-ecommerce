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

    el: "#appsingleprod",
    data: {
        loggedin: {},
        product: [],
        test: 0,
        reviews: [],
        rating: 0,
        reviewrating: 0,
        editReview: {
            "reviewID": "a",
            "ratingnumber": 0,
            "comment": "a",
            "userID": "a",
            "date": "a"
        },
        prodname: "",
        sizes: [],
        colors: [],
        colors1: {},
        order: [{
            "prodID": "None",
            "propID": 0,
            "quantity": "None"


        }],
    },
    mounted() {
        $("#navbar").load("footer.html");
        $("#footer").load("footer.html");


    },
    methods: {
        getBBHTML(bbcode) {
            //Replace all new lines with [br] tag
            const res = bbcode.replace(/(\r\n|\r|\n)/g, '[br][/br]');
            return BBCodeParser.process(res);
        },
        loadProduct(id) {
            //Load  questions
            $.ajax({
                url: 'products/byProdId/' + id,
                type: 'GET',
                success: (data) => {
                    this.product = data
                    this.prodname = data[0].name
                    this.order.prodID = data[0].prodID
                    var checker = []
                    this.colors1 = {}
                    for (var i = 0; i < data.length; i++) {


                        if (jQuery.inArray(this.product[i].colorID, checker) == -1) {

                            this.colors.push(this.product[i])
                            checker.push(this.product[i].colorID)

                        }


                        if (this.product[i].colorID === this.product[0].colorID) {
                            if (jQuery.inArray(this.product[i].size, this.sizes) != -1) {

                            } else {
                                this.sizes.push(this.product[i].size)
                                this.colors1[this.product[i].propID] = this.product[i].size
                            }

                        }
                    }
                    this.order.propID = 0


                },
                error: (data) => {
                    console.log("AAA")
                    return null
                }
            });
            //update questions
        },
        loadReviews(id) {
            //Load  questions

            $.ajax({
                url: 'products/reviewsByProdId/' + id,
                type: 'GET',
                success: (result) => {
                    this.reviews = result
                    var totalrating = 0
                    for (var i = 0; i < this.reviews.length; i++) {
                        totalrating += this.reviews[i].ratingnumber
                    }
                    this.rating = (totalrating / this.reviews.length).toFixed(2)

                },
                error: (data) => {
                    console.log(data)
                    return null
                }
            });

            //update questions
        },
        deleteReview(reviewID) {
            //Load  questions

            $.ajax({
                url: 'products/deleteReview/' + reviewID,
                data: reviewID,
                type: 'DELETE',
                success: (reviewID) => {
                    for (var i = 0; i < this.reviews.length; i++) {
                        if (this.reviews[i].reviewID === reviewID) {
                            delete this.reviews[i]
                            console.log(this.reviews)
                        }
                    }
                    location.reload()

                },
                error: (data) => {
                    console.log(data)
                    return null
                }
            });

            //update questions
        },
        updateReview: function (reviewID) {
            alert(reviewID)

        },
        openReviewContainer: function () {
            $("#reviewform").slideToggle();
        },
        updateReview: function (id, comment, date, userID, ratingnumber) {
            for (var i = 0; i < this.reviews.length; i++) {
                if (this.reviews[i].reviewID != id) {
                    if ($('#' + this.reviews[i].reviewID).is(':visible')) {
                        $('#' + this.reviews[i].reviewID).slideToggle();
                    }
                }

            }

            $('#' + id).slideToggle();
            this.editReview.reviewID = id
            this.editReview.comment = comment
            this.editReview.date = date
            this.editReview.userID = userID
            this.editReview.ratingnumber = ratingnumber

        },



        updatePicturePick: function (id) {
            for (var i = 0; i < this.product.length; i++) {

                $('#' + this.product[i].propID).css({
                    'border': '0px solid black'
                });
            }

            $('#' + id).css({
                'border': '1px solid black'
            });

        },
        updateSizePick: function (id, products) {
            for (var i = 0; i < this.product.length; i++) {
                $('#' + this.product[i].propID + "1").css({
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
                $('#' + this.product[i].size).css({
                    'background-color': 'white'
                });

            }


        },




        changeColor: function (id) {
            for (var i = 0; i < this.product.length; i++) {
                $('#' + this.product[i].size).css({
                    'background-color': 'white'
                });

            }
            $('#' + id).css({
                'background-color': 'lightgrey'
            });

        },
        updateCorrectSizes: function (colorID) {
            this.colors1 = {}

            this.sizes = []
            for (var i = 0; i < this.product.length; i++) {

                if (this.product[i].colorID === colorID) {
                    if (jQuery.inArray(this.product[i].size, this.sizes) != -1) {

                    } else {

                        this.sizes.push(this.product[i].size)
                        this.colors1[this.product[i].propID] = this.product[i].size

                    }

                }
            }
            

            //this.sizes.sort();
            $("#sizecontainer").load(window.location.href + " #sizecontainer");
            this.order.propID = 0
        },
        reviewStarsUp: function () {
            if (this.reviewrating < 5) {
                this.reviewrating += 1
                $("#writereviewstars").load(window.location.href + " #writereviewstars");
            }


        },
        reviewStarsDown: function () {
            if (this.reviewrating >= 0) {
                this.reviewrating -= 1
                $("#writereviewstars").load(window.location.href + " #writereviewstars");
            }
        },
        editreviewStarsUp: function () {
            if (this.editReview.ratingnumber < 5) {
                this.editReview.ratingnumber += 1
                $("#editwritereviewstars").load(window.location.href + " #editwritereviewstars");
            }

        },
        editreviewStarsDown: function () {
            if (this.editReview.ratingnumber >= 0) {
                this.editReview.ratingnumber -= 1
                $("#editwritereviewstars").load(window.location.href + " #editwritereviewstars");
            }

        },

        postReview() {
            const current = new Date();
            const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;


            const data = {
                "userID": this.loggedin.id,
                "prodID": this.product[0].prodID,
                "ratingnumber": this.reviewrating,
                "comment": $('#comment').val(),
                "date": date
            }
            $.ajax({
                url: 'products/addReview',
                method: "POST",
                data: data,
                success: () => {
                    console.log("Review was added")
                    location.reload();

                },
            })
        },
        postUpdateReview() {
            const data = {

                "reviewID": this.editReview.reviewID,
                "ratingnumber": this.editReview.ratingnumber,
                "comment": $('#comment' + this.editReview.reviewID).val(),

            }

            $.ajax({
                url: 'products/editreview',
                method: "put",
                data: data,
                success: () => {
                    console.log("Review has been updated")
                    location.reload();

                },
            })
        },

        updateOrder: function (propID) {
            this.order.propID = propID


        },
        notloggedinpopup: function () {
            $("#loginpopup").slideToggle();
            setTimeout(function () {
                $('#loginpopup').fadeOut('fast');
            }, 1000);


        },
        pleasechoosesize: function () {
            $("#choosesize").slideToggle();
            setTimeout(function () {
                $('#choosesize').fadeOut('fast');
            }, 1000);


        },
        shoptoggle: function(){
            $("#navigation-cart").slideToggle();
            setTimeout(function () {
                $('#navigation-cart').fadeOut('fast');
            }, 3000);
        },



       // if(propID in cart){
        //     cart[propID].amount = cart[propID].amount + 1
        //}else{
         //    cart[propID] = req.body
          //   cart[propID]["amount"] = 1
        //}



        addToCart: function () {
            let googleuser = false;
            this.order.prodID = this.product[0].prodID
            if (this.order.propID != 0) {

                if(navbarvm.loggedin.type === "GOOGLE"){
                    googleuser = true
                    const cart = {};

                    if(this.order.propID != 0){
                        for (var i = 0; i < this.product.length; i++){
                            if(this.product[i].propID in cart){
                                cart[this.product[i].propID].amount = cart[this.product[i].propID].amount +1
                            }else{
                                cart[this.product[i].propID] = this.product[i]
                                cart[this.product[i].propID]['amount'] = 1
                            }

                        }
                        navbarvm.updateGoogleUserCart(cart);

                    }
                }
                if (this.loggedin.id) {
                    if (this.order.propID != 0) {
                        var prod;
                        for (var i = 0; i < this.product.length; i++) {
                            if (this.product[i].propID === this.order.propID) {
                                prod = this.product[i]

                            }
                        }

                        $.ajax({
                            url: '/auth/pushToShoppingCart',
                            method: 'POST',
                            data: prod,
                            success: () => {
                                console.log("Product added")
                                
                                navbarvm.getLoggedInUser()
                                vm.shoptoggle()
                            }
                        })
                    }
                } else if(!googleuser) {
                    vm.notloggedinpopup()
                    
                }
            } else {
                vm.pleasechoosesize()
            }

        },

        getLoggedInUser() {
            $.ajax({
                url: '/auth/loggedInUser',
                type: 'GET',
                success: (result) => {
                    this.loggedin = result;

                }
            })
        },
    }
});
vm.loadProduct("01126187-4005-4972-97cf-7fd8f9cfa754")
vm.loadReviews("01126187-4005-4972-97cf-7fd8f9cfa754")
vm.getLoggedInUser();