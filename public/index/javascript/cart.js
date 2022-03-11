const checkoutvm = new Vue({

    el: "#appcheckout",
    data: {
        loggedin: {},
        test_html: "",
        klarna_obj: {}

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
                url: '/auth//removeFromShoppingCart',
                type: 'POST',
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
                "propID": propID
            }
            $.ajax({
                url: '/auth/updateAmount',
                type: 'POST',
                data: obj,
                success: (result) => {
                    this.getLoggedInUser()
                    navbarvm.getLoggedInUser()
                }
            })
        },


        //SAMPLE EMAIL FUNCTION
        email() {
            $.ajax({
                url: '/user/getEmails',
                type: 'GET',
                success: (result) => {
                    let obj = {}
                    let keys = Object.keys(result);
                    for (let i = 0; i < keys.length; i++) {
                        obj[i] = result[i]
                    }

                    $.ajax({
                        url: '/services/email',
                        type: 'POST',
                        data: obj,
                        success: (email_res) => {
                            console.log(email_res)

                        }

                    })
                }
            })


        },




        makeKlarnaOrder() {
            let obj = {
                "shoppingcart": this.loggedin.shoppingcart,
                "total": this.loggedin.totalInCart
            }

            $.ajax({
                url: '/klarna/generateKlarnaOrderId',
                type: 'POST',
                data: obj,
                success: (result) => {
                    console.log(result)
                    this.klarna_obj = result

                    //Save klarna_obj in session
                    const data = {
                        "klarna_obj": this.klarna_obj,
                    }

                    $.ajax({
                        url: '/auth/updateKlarnaObj',
                        method: "POST",
                        data: data,
                        success: (result) => {
                            console.log("Klarna object added", result)
                            this.getLoggedInUser();
                        }
                    });



                    var checkoutContainer = document.getElementById('my-checkout-container')
                    checkoutContainer.innerHTML = this.klarna_obj.html_snippet;
                    var scriptsTags = checkoutContainer.getElementsByTagName('script')
                    for (var i = 0; i < scriptsTags.length; i++) {
                        var parentNode = scriptsTags[i].parentNode
                        var newScriptTag = document.createElement('script')
                        newScriptTag.type = 'text/javascript'
                        newScriptTag.text = scriptsTags[i].text
                        parentNode.removeChild(scriptsTags[i])
                        parentNode.appendChild(newScriptTag)
                    }


                }

            })
        }

    }
});