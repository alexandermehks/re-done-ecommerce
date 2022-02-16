

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

                              if (this.product[i].colorID === this.product[0].colorID) {
                                   if (jQuery.inArray(this.product[i].size, this.sizes) != -1) {

                                   } else {
                                        this.sizes.push(this.product[i].size)
                                   }

                              }
                         }

                         //this.sizes.sort();


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
          openReviewContainer: function () {
               $("#reviewform").slideToggle();
          },



          updatePicturePick: function (id) {
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

               this.sizes = []
               for (var i = 0; i < this.product.length; i++) {

                    if (this.product[i].colorID === colorID) {
                         if (jQuery.inArray(this.product[i].size, this.sizes) != -1) {

                         } else {

                              this.sizes.push(this.product[i].size)
                         }

                    }
               }

               //this.sizes.sort();
               $("#sizecontainer").load(window.location.href + " #sizecontainer");

          },
          reviewStars: function () {
               console.log("HAWHDAHW")


          },
       
          postReview() {
               const current = new Date();
               const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
      
               
               const data = {
                   "userID": "0170d36a-78c3-4765-b515-56a6d700bcad",
                   "prodID": this.product[0].prodID,
                   "ratingnumber": 2,
                   "comment": $('#comment').val(),
                   "date": date
               }
               console.log(data)
               $.ajax({
                   url: 'products/addReview',
                   method: "POST",
                   data: data,
                   success:() =>{
                       console.log("Review was added")
                       location.reload();
                      
                   },
                   error: function() {
                       console.log("error")
                   }
   
               });
   
   
           },

     }



});
vm.loadProduct("id1")
vm.loadReviews("id1")

