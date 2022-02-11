$(document).ready(function() {

 
$("#filter-dropdown").click(
    function() {
        $(".filters").slideToggle();
        
    });

$('.btn-4').click(function(){
   $(this).toggleClass('active');
    console.log("skit på digf")
});

$('.color').click(function(){
    $(this).toggleClass('active');
     
 });


 $( "#slider-range" ).slider({
    range: true,
    min: 0,
    max: 500,
    values: [ 75, 300 ],
    slide: function( event, ui ) {
      $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
    }
  });
  $( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
    " - $" + $( "#slider-range" ).slider( "values", 1 ) );
   
   
$( ".selector" ).slider({
  start: function( event, ui ) {}
});

console.log();


$(function(){
  $("#navbar").load("navbar.html"); 
});

$(function () {
    $("#productcard").load("productcard.html");
});


}); 

const vm = new Vue({   
  el: "#appee",
  data: {
    products: [],
    product:[],
  },
  methods: {


  },

  mounted() {
    //method to get all products
      var self = this;
      $.getJSON("products/all/", function (jsondata) {
      //  console.log(JSON.stringify(jsondata));
        self.products = jsondata;
        console.log("haha");
      
      });
    }

    

});
