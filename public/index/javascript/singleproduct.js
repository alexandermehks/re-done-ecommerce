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
        reviews: [],
        rating: 0,
        reviewrating : 0,
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
        console.log("HELLO?")
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
                    var checker = []
                    for (var i = 0; i < data.length; i++) {
                        
                    
                    if (jQuery.inArray(this.product[i].colorID, checker) == -1) {

                        this.colors.push(this.product[i])
                        checker.push(this.product[i].colorID)
                        console.log(checker)
                    }


                    if (this.product[i].colorID === this.product[0].colorID) {
                        if (jQuery.inArray(this.product[i].size, this.sizes) != -1) {

                        } else {
                            this.sizes.push(this.product[i].size)
                            let val = this.product[i].propID
                            this.colors1[val] = this.product[i].size
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
            console.log(this.rating)
        },
        error: (data) => {
            console.log(data)
            return null
        }
    });

    //update questions
},
openReviewContainer: function() {
    $("#reviewform").slideToggle();
},



updatePicturePick: function(id) {
    for (var i = 0; i < this.product.length; i++) {
        console.log("aWD")
        $('#' + this.product[i].propID).css({
            'border': '0px solid black'
        });
    }

    $('#' + id).css({
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
updatePicture: function(url) {
    $("#picbig").attr('src', url);


},
updatePictureColor: function(url) {
    $("#picbig").attr('src', url);
    for (var i = 0; i < this.product.length; i++) {
        $('#' + this.product[i].size).css({
            'background-color': 'white'
        });

    }

},
changeColor: function(id) {
    for (var i = 0; i < this.product.length; i++) {
        $('#' + this.product[i].size).css({
            'background-color': 'white'
        });

    }
    $('#' + id).css({
        'background-color': 'lightgrey'
    });
    

},
updateCorrectSizes: function(colorID) {
    this.colors1 = {}
    this.sizes = []
    for (var i = 0; i < this.product.length; i++) {

        if (this.product[i].colorID === colorID) {
            if (jQuery.inArray(this.product[i].size, this.sizes) != -1) {

            } else {

                this.sizes.push(this.product[i].size)
                let val = this.product[i].propID
                this.colors1[val] = this.product[i].size
            }

        }
    }
    this.order.propID = 0;
    console.log(this.colors1)

    //this.sizes.sort();
    $("#sizecontainer").load(window.location.href + " #sizecontainer");

},
reviewStarsUp: function() {
    if(this.reviewrating <5){
        this.reviewrating += 1
        $("#writereviewstars").load(window.location.href + " #writereviewstars");
    }


},
reviewStarsDown: function() {
    if(this.reviewrating >= 0){
        this.reviewrating -= 1
        $("#writereviewstars").load(window.location.href + " #writereviewstars");
    }


},

postReview() {
    const current = new Date();
    const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;
    console.log(date)


    const data = {
        "userID": "0170d36a-78c3-4765-b515-56a6d700bcad",
        "prodID": this.product[0].prodID,
        "ratingnumber": this.reviewrating,
        "comment": date,
        "date": date
    }
    console.log(data)
    $.ajax({
        url: 'products/addReview',
        method: "POST",
        data: data,
        success: () => {
            console.log("Review was added")
            location.reload();

        },
        error: function () {
            console.log("error")
        }

    });


},
addToCart: function(propID) {
    
    this.order.prodID = this.product[0].prodID
    if(this.order.propID === 0){
        alert("Please choose a size")
    }
    console.log(this.order.propID)
    
    },

    updateOrder: function(propID) {
        this.order.propID = propID
        
        console.log(this.order)
        },


}

    



});
vm.loadProduct("01126187-4005-4972-97cf-7fd8f9cfa754")
vm.loadReviews("01126187-4005-4972-97cf-7fd8f9cfa754")