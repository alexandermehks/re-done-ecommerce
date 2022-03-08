$(document).ready(function() {


    var currentMousePos = { x: -1, y: -1 };
    $(document).mousemove(function(event) {
        currentMousePos.x = event.pageX;
        currentMousePos.y = event.pageY;
        //Black magic to fix bug where shopping cart and profile displays at same time
        if ($(".navigation-profile").css("display") != "none" && $(".navigation-cart").css("display") != "none")
            $(".navigation-cart").hide();
    });

    var prevScrollpos = window.pageYOffset;
    window.onscroll = function() {
        var currentScrollPos = window.pageYOffset;
        document.getElementById("navigation").style.top = -currentScrollPos + "px";
        const navHeight = document.querySelector('#navigation').offsetHeight;

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
            $(".navigation-profile").hide();
            $(".navigation-cart").hide();
            $(".navigation-search-holder").hide();
            //Enable scroll on body
            $('html, body').css({
                overflow: 'auto',
                height: 'auto'
            });
            $(".navigation-categories").slideDown();
        }
    );

    $("#profile-icon").click(
        function() {
            $(".navigation-categories").hide();
            $(".navigation-cart").hide();
            $(".navigation-profile").slideDown();
        }
    );

    $("#cart-icon").click(
        function() {
            $(".navigation-categories").hide();
            $(".navigation-profile").hide();
            $(".navigation-cart").slideDown();
        }
    );

    $(".navigation").hover(function() {
        document.getElementById("navigation").style.top = 0 + "px";
    });

    $(".navigation").mouseleave(function() {
        $(".navigation-categories").slideUp();
    });

    $("#search-icon").click(function() {

        if ($('.navigation-search-holder:visible').length == 0) {
            //If search-area is hidden, show it
            $(".navigation-search-holder").slideDown()
            $(".navigation-categories").hide();
            //Disable scroll on body
            $('html, body').css({
                overflow: 'hidden',
                height: '100%'
            });
        } else {
            //If search-area is showing, hide it
            $(".navigation-search-holder").slideUp()
                //Enable scroll on body
            $('html, body').css({
                overflow: 'auto',
                height: 'auto'
            });

        }



    });

    $(".close-button").click(function() {
        $(".navigation-search-holder").slideUp()
            //Enable scroll on body
        $('html, body').css({
            overflow: 'auto',
            height: 'auto'
        });
    });

    $(".top-search-button").click(function() {
        let searchValue = $(this).html();
        $("#search-input").val(searchValue);

    });

    let height = $(window).height() - $('nav').height() - $('#search-input').height() - 7;

    //Add has-val class if input contains chars

    $(".input100").change(function() {
        let val = $(this).val()
        if (val.length > 0) {
            $(this).addClass('has-val');
        } else {
            $(this).removeClass('has-val');
        }
    });













    //Set height of search window
    //$('.navigation-search-content').height(height);

});