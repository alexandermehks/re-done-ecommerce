$(document).ready(function() {


    var currentMousePos = { x: -1, y: -1 };
    $(document).mousemove(function(event) {
        currentMousePos.x = event.pageX;
        currentMousePos.y = event.pageY;
    });


    const navHeight = document.querySelector('#navigation').offsetHeight;
    var prevScrollpos = window.pageYOffset;
    window.onscroll = function() {
        var currentScrollPos = window.pageYOffset;
        document.getElementById("navigation").style.top = -currentScrollPos + "px";


        if (currentScrollPos > navHeight) {
            $("#searchbar").fadeOut()
            $(".navigation-profile").slideUp();
            $(".navigation-cart").slideUp();
            if (prevScrollpos > currentScrollPos) {


                document.getElementById("navigation").style.top = 0 + "px";
            } else {}
        }
        prevScrollpos = currentScrollPos;
    }

    $(document).mouseup(function(e) {
        var container = $(".navigation-profile")
            // if the target of the click isn't the container nor a descendant of the container
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            $(".navigation-profile").slideUp();

        }

        var container2 = $(".navigation-cart")
            // if the target of the click isn't the container nor a descendant of the container
        if (!container2.is(e.target) && container2.has(e.target).length === 0) {
            $(".navigation-cart").slideUp();

        }
    });

    $("#category-categories").hover(
        function() {

            $(".navigation-categories").slideDown();
            $(".navigation-profile").hide();
            $(".navigation-cart").hide();
        }
    );

    $("#profile-icon").hover(
        function() {
            $(".navigation-categories").hide();
            $(".navigation-cart").hide();
            $(".navigation-profile").slideDown();
        }
    );

    $("#cart-icon").hover(
        function() {
            $(".navigation-categories").hide();
            $(".navigation-cart").slideDown();
            $(".navigation-profile").hide();
        }
    );

    $(".navigation").hover(function() {
        document.getElementById("navigation").style.top = 0 + "px";
    });

    $(".navigation").mouseleave(function() {
        $(".navigation-categories").slideUp();
    });

    $("#search-icon").click(function() {
        $("#searchbar").fadeIn()
    });
});