







const checkoutvm = new Vue({

    el: "#appcheckout",
    data: {
        loggedin: {},
        
    },
    mounted() {
        $("#navbar").load("navbar.html");
        $("#footer").load("footer.html");
        this.getLoggedInUser();
    },
    methods: {
     
        beforeMount() {
          
            this.getLoggedInUser();
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

        removeFromCart(id) {
            let obj = {
                "prodID": id
            }
            $.ajax({
                url:'/auth//removeFromShoppingCart',
                type:'POST',
                data: obj, 
                success: (result) => {
                    this.getLoggedInUser()
                    navbarvm.getLoggedInUser()
                }
            })

        },




        


        updateAmount(value, propID) {
           let val = value.target.value
           let obj = {
                "value": val,
                "propID":propID
           }
            $.ajax({
                url:'/auth/updateAmount',
                type: 'POST',
                data: obj,
                success: (result) => {
                    this.getLoggedInUser()
                    navbarvm.getLoggedInUser()
                }
            })
        }
        
    }
});

