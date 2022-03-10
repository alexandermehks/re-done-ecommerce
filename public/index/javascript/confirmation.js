const vm = new Vue({
    el: "#app",
    data: {
        loggedin: {},


    },

    mounted() {
        $(function() {
            $("#navbar").load("navbar.html");
            $("#footer").load("footer.html");
        });

        this.getLoggedInUser();

    },
    methods: {
        do_test() {
            console.log("test")
        },
        getLoggedInUser() {
            $.ajax({
                url: '/auth/loggedInUser',
                type: 'GET',
                success: (result) => {
                    this.loggedin = result;
                    console.log("HEJ")
                    if (this.loggedin.klarna_obj) {

                        const data = {
                            "order_id": this.loggedin.klarna_obj.order_id
                        }


                        $.ajax({
                            url: '/klarna/getKlarnaOrder',
                            type: 'POST',
                            data: data,
                            success: (result) => {
                                this.klarna_obj = result;
                                console.log(result)
                                var checkoutContainer = document.getElementById('my-checkout-container')
                                checkoutContainer.innerHTML = this.klarna_obj.html_snippet;
                                console.log(this.klarna_obj)
                                var scriptsTags = checkoutContainer.getElementsByTagName('script')
                                for (var i = 0; i < scriptsTags.length; i++) {
                                    var parentNode = scriptsTags[i].parentNode
                                    var newScriptTag = document.createElement('script')
                                    newScriptTag.type = 'text/javascript'
                                    newScriptTag.text = scriptsTags[i].text
                                    parentNode.removeChild(scriptsTags[i])
                                    parentNode.appendChild(newScriptTag)
                                }
                                this.addOrder();


                            }
                        })
                    } else {
                        console.log("No order id available")
                    }

                }
            })
        },
        addOrder() {
            //console.log("NAVBAR", navbarvm.loggedin)
            navbarvm.checkout()
        }


    }

});