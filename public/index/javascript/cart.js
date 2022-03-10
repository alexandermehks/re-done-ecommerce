const checkoutvm = new Vue({

    el: "#appcheckout",
    data: {
        loggedin: {},
        
        
    },
    mounted() {
        $("#navbar").load("navbar.html");
        $("#footer").load("footer.html");
        this.getLoggedInUser();
        $("#KCO").html(this.loggedin.klarna_html)
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
           let obj = {
                "value": value,
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
        },


        //SAMPLE EMAIL FUNCTION
        email(){
            $.ajax({
                url:'/user/getEmails',
                type: 'GET',
                success: (result) => {
                    let obj = {}
                    let keys = Object.keys(result);
                    for(let i = 0; i < keys.length; i++){
                        obj[i] = result[i]
                    }

                    $.ajax({
                        url:'/services/email',
                        type: 'POST',
                        data: obj,
                        success: (email_res) =>{
                            console.log(email_res)
                        }

                    })
                }
            })

           
        },




        makeKlarnaOrder(){
            let obj = {
                "shoppingcart": this.loggedin.shoppingcart,
                "total": this.loggedin.totalInCart
            }
            
            $.ajax({
                url: '/klarna/generateKlarnaOrderId',
                type: 'POST',
                data: obj,
                success: (result) => {
                    let html = result.html_snippet

                    $.ajax({
                        url: '/auth/updateKlarnaHtml',
                        type: 'POST',
                        data: html,
                        success: (result) => {
                            this.getLoggedInUser()
                            navbarvm.getLoggedInUser()
                            window.location.href = "klarna_checkout"
                        }
                    })
                }

            })
        }
        
    }
});

