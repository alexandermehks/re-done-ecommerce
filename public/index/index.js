const vm = new Vue({
    el: "#app",
    data: {
        msg: 'aasd',
        msg2: 'asd2',
        title: "Alex webpage",
        posts: [
            { id: 1, title: 'My journey with Vue' },
            { id: 2, title: 'Blogging with Vue' },
            { id: 3, title: 'Why Vue is so fun' },
            { id: 3, title: 'HELO ALEX' }
        ]
    },

    methods: {
        do_test() {
            alert("Function from index.js VUE WORKS")
            console.log("From index.js")
            document.title = "A new title"
        },

        getUser() {
            $.ajax({
                url: '/user/users',
                type: 'GET',
                success: (result) => {
                    const element = document.getElementById("FAK")
                    if (element.style.color === "red") {
                        element.setAttribute("style", "color:black");
                    } else {
                        element.setAttribute("style", "color:red");
                    }
                    console.log(result[0].name)

                }
            })

        }
    }




})


frontend / index.js /
    home / am / git / kingnation / frontend / index.js