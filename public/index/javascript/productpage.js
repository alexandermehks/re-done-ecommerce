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
      productC:[],
      ProductsType:[],
      productss:[],
      currentShow:[],
  
    },
    methods: {
  
      updateProd:function(e){
        this.currentShow = []
      //  this.currentShow.push(this.products[0])
        const buttonValues = e.target.value;
        //console.log(buttonValues);
        console.log(this.products)
        for (var i = 0; i < this.products.length; i++){
          console.log("hej");
          if (this.products[i].type === buttonValues){
            this.currentShow.push(this.products[i])
          }
        }
          
        
      
  
        $("#productUpd").load(window.location.href + " #productUpd");
          
  
        
  
      },
  
      getSingle:function(id){
        
        $.ajax({
          url: "products/singleProduct/" + id,
          type: 'GET',
          success: (result) =>{
            console.log(result)
          }
          })
      },
    
  /*
      getCategory(e) {
        const buttonValues = e.target.value;
        //console.log(buttonValues)
      
        $.ajax({
          url: "products/product/" + buttonValues,
          type: 'GET',
          success: (result) =>{
            console.log(result)
            this.ProductsType = result;
            
          }
             })
  
      }
      
    */    
  
   
      
     
  
    
  
  
    },
  
    mounted() {
      //method to get all products
        var self = this;
        $.getJSON("products/all/", function (jsondata) {
        //  console.log(JSON.stringify(jsondata));
  
        let filter = {}
  
          for(i in jsondata){
            let prod = jsondata[i];
            if (!(filter.hasOwnProperty(prod.prodID))){
              filter[prod.prodID] = []
            }
  
            
            if(filter[prod.prodID].length == 0 ){
              filter[prod.prodID].push(prod)
            } else {
              let found = false;
              for (j in filter[prod.prodID]){
                let prod2 = filter[prod.prodID][j];
                console.log(prod2)
                if(prod.colorID === prod2.colorID){
                  found = true;
                  break;
                }
              }
              if(!found)
                filter[prod.prodID].push(prod)
            }
          }
  
  
            let res = []
            for (id in filter){
              for (id2 in filter[id]){
                let prod = filter[id][id2];
                console.log(prod.prodID, prod.colorID)
                res.push(prod)
              }
            }
  
  
          self.products = res;
          self.currentShow = res;
          console.log(this.currentShow)
        
        
        });
      }
  
      
  
  });
  