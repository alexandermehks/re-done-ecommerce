$(document).ready(function() {


    function distance(rect, p) {
        console.log(rect)
        var dx = Math.max(rect.left - p.x, 0, p.x - rect.top);
        var dy = Math.max(rect.bottom - p.y, 0, p.y - rect.bottom);
        console.log(dx, dy, "bajs", Math.sqrt(dx * dx + dy * dy))
        return Math.sqrt(dx * dx + dy * dy);
    }

    var currentMousePos = { x: -1, y: -1 };
    $(document).mousemove(function(event) {
        currentMousePos.x = event.pageX;
        currentMousePos.y = event.pageY;
    });


    const navHeight = document.querySelector('#navigation').offsetHeight;
    var prevScrollpos = window.pageYOffset;
    window.onscroll = function() {
        var currentScrollPos = window.pageYOffset;
        //$("#navigation").get(0).style.setProperty("width", 10);
        document.getElementById("navigation").style.top = -currentScrollPos + "px";


        if (currentScrollPos > navHeight) {
            $("#searchbar").fadeOut()
            $(".navigation-profile").slideUp();
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
    });


    $("#category-categories").hover(
        function() {

            $(".navigation-categories").slideDown();
            $(".navigation-profile").slideUp();
        }
    );

    $("#profile-icon").hover(
        function() {
            $(".navigation-categories").slideUp();
            $(".navigation-profile").slideDown();
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