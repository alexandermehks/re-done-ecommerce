const vm = new Vue({

    el: "#app",
    data: {
        loggedin: {},
        choosenProduct: {},
        product: [],
        loggedinreview: 0,
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
        currImg: 0,
        categories: [],
        initPropID: "",
        initPropColor: 0,
        initPropUrl: "",



    },
    mounted() {
        $("#navbar").load("navbar.html");
        $("#footer").load("footer.html");

        //Get page id
        let prodID = new URL(location.href).searchParams.get('prodID')
        if (!prodID) {
            prodID = "57984369-c562-45de-b33c-1a011b372810";
        }




        this.loadProduct(prodID)
        this.loadReviews(prodID)
        this.getAllCategories();




    },
    beforeMount() {



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
                    //console.log(data)
                    //IF valid id, get product
                    if (data.length > 0) {

                        this.product = data
                        this.prodname = data[0].name
                        this.order.prodID = data[0].prodID
                        var checker = []
                        this.colors1 = {}

                        let propID = new URL(location.href).searchParams.get('propID')
                        let propPicUrl = ""
                        let propColorId = 0

                        //this.updatePicturePick(prod.propID);
                        //this.updatePictureColor(prod.picURL)
                        //this.updateCorrectSizes(prod.colorID)
                        this.choosenProduct = this.product[0]
                        for (var i = 0; i < data.length; i++) {
                            let prod = this.product[i];
                            if (prod.propID == propID) {
                                this.choosenProduct = prod;
                            }

                            if (jQuery.inArray(this.product[i].colorID, checker) == -1) {

                                this.colors.push(this.product[i])
                                checker.push(this.product[i].colorID)

                            }


                            if (this.product[i].colorID === this.choosenProduct.colorID) {
                                if (jQuery.inArray(this.product[i].size, this.sizes) != -1) {

                                } else {
                                    this.sizes.push(this.product[i].size)
                                    this.colors1[this.product[i].propID] = this.product[i]
                                }

                            }
                        }
                        this.order.propID = 0
                        this.updateCorrectSizes(this.choosenProduct)


                    } else {
                        //IF invalid id, return default product
                        if (id != "57984369-c562-45de-b33c-1a011b372810") {
                            this.loadProduct("57984369-c562-45de-b33c-1a011b372810")
                        }
                    }

                },
                error: (data) => {
                    //IF invalid id, return default product
                    if (id != "57984369-c562-45de-b33c-1a011b372810") {
                        this.loadProduct("57984369-c562-45de-b33c-1a011b372810")
                    }
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
                    console.log(this.reviews)
                    var totalrating = 0
                    for (var i = 0; i < this.reviews.length; i++) {
                        totalrating += this.reviews[i].ratingnumber
                    }
                    this.rating = (totalrating / this.reviews.length).toFixed(2)
                    if (this.reviews.length == 0) {
                        this.rating = 0
                    }
                    this.getLoggedInUser();


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
        updateReview: function(reviewID) {
            alert(reviewID)

        },
        openReviewContainer: function() {
            $("#reviewform").slideToggle();
        },
        updateReview: function(id, comment, date, userID, ratingnumber) {
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



        updatePicturePick: function(property) {

            //call this


            for (var i = 0; i < this.product.length; i++) {

                $('#' + this.product[i].propID).css({
                    'border': '0px solid black'
                });
            }

            $('#' + property.propID).css({
                'border': '1px solid black'
            });

        },
        updateSizePick: function(id, products) {
            for (var i = 0; i < this.product.length; i++) {
                $('#' + this.product[i].propID + "1").css({
                    'background-color': 'white'
                });
            }
            $('#' + id + "1").css({
                'background-color': 'lightgrey'
            });


        },
        updatePicture: function(url, index) {
            $("#picbig").attr('src', url);
            this.currImg = index

        },
        updatePictureColor: function(property) {



            $("#picbig").attr('src', property.picURL);
            for (var i = 0; i < this.product.length; i++) {
                $('#' + this.product[i].size).css({
                    'background-color': 'white'
                });

            }


        },




        changeColor: function(property) {
            for (var i = 0; i < this.product.length; i++) {
                $('#' + this.product[i].size).css({
                    'background-color': 'white'
                });

            }
            $('#' + property.size).css({
                'background-color': 'lightgrey'
            });

        },
        updateCorrectSizes: function(property) {
            this.colors1 = {}

            this.sizes = []
            for (var i = 0; i < this.product.length; i++) {

                if (this.product[i].colorID === property.colorID) {
                    if (jQuery.inArray(this.product[i].size, this.sizes) != -1) {

                    } else {

                        this.sizes.push(this.product[i].size)
                        this.colors1[this.product[i].propID] = this.product[i]

                    }

                }
            }


            //this.sizes.sort();
            $("#sizecontainer").load(window.location.href + " #sizecontainer");
            this.order.propID = 0
        },
        reviewStarsUp: function() {
            if (this.reviewrating < 5) {
                this.reviewrating += 1
                $("#writereviewstars").load(window.location.href + " #writereviewstars");
            }


        },
        reviewStarsDown: function() {
            if (this.reviewrating >= 0) {
                this.reviewrating -= 1
                $("#writereviewstars").load(window.location.href + " #writereviewstars");
            }
        },
        editreviewStarsUp: function() {
            if (this.editReview.ratingnumber < 5) {
                this.editReview.ratingnumber += 1
                $("#editwritereviewstars").load(window.location.href + " #editwritereviewstars");
            }

        },
        editreviewStarsDown: function() {
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
                "prodID": this.choosenProduct.prodID,
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

        updateOrder: function(property) {
            this.order.propID = property.propID


        },
        notloggedinpopup: function() {
            $("#loginpopup").slideToggle();
            setTimeout(function() {
                $('#loginpopup').fadeOut('fast');
            }, 1000);


        },
        pleasechoosesize: function() {
            $("#choosesize").slideToggle();
            setTimeout(function() {
                $('#choosesize').fadeOut('fast');
            }, 1000);


        },
        shoptoggle: function() {
            $("#navigation-cart").slideToggle();
            setTimeout(function() {
                $('#navigation-cart').fadeOut('fast');
            }, 3000);
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
                }
            })
        },



        // if(propID in cart){
        //     cart[propID].amount = cart[propID].amount + 1
        //}else{
        //    cart[propID] = req.body
        //   cart[propID]["amount"] = 1
        //}



        addToCart: function() {
            this.order.prodID = this.choosenProduct.prodID
            if (this.order.propID != 0) {
                console.log("BAJS")

                if (this.loggedin.id || this.loggedin.type === "GOOGLE") {
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
                } else {
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

                    for (var i = 0; i < this.reviews.length; i++) {
                        console.log(this.loggedin.id, this.reviews[i].userID)
                        if (this.loggedin.id === this.reviews[i].userID) {
                            this.loggedinreview = 1
                        }

                    }

                }
            })
        },

    }
});


function emptysizes() {
    document.getElementById('S').setAttribute("class", "style1");
}

function changeStarColor(id) {
    document.getElementById(id).style.color = "orange";
}