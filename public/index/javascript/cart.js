







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
                    
                   
                    console.log(this.loggedin)
                    


                }
            })
        },
        
    }
});

