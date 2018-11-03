/*----------------------------------------------------*/
/* Html bridge
------------------------------------------------------ */
// $(function(){
//     $("#aboutMeSection").load("sub_mod/sec_about.html");
// });
//
//
// $(function(){
//     $("#contactSection").load("sub_mod/sec_contact.html");
// });
//
// $(function(){
//     $("#expSection").load("sub_mod/sec_experience.html");
// });
//
// $(function(){
//     $("#projectSection").load("sub_mod/sec_projects.html");
// });
// //
//
$(function(){
    loadJsonFileSideBar();
    setTimeout(function(){
        var curPageObj = $(".page-scroll.nav-bar-click.active");
        reloadPage(curPageObj, true);
        G_target = curPageObj.attr("href");
        loadSideBarRemappedBy(G_target);
        updateItemTarget();
    }, 200);

});


$(function(){
    $("#modalTemplate").load("sub_mod/modal_template_projects.html");
});

$(function(){
    $("#modalTemplatePhoto").load("sub_mod/modal_template_photos.html");
});

/*----------------------------------------------------*/
/* Menu Navbar
------------------------------------------------------ */
// See sec_projects.js


/*----------------------------------------------------*/
/* Body clicked
------------------------------------------------------ */
$(document).on('click', '#view-area', function (e) {
    var $this = $(this);
    var $top_nav = $("#top-navbar-selection");
    var $side_nav = $("#sidebar");
    // Hide nav bar
    if($top_nav.attr('aria-expanded'))
    {
        $top_nav.collapse("hide");
    }
    // Hide side bar
    if(G_target !== "#page-about")
    {
        if($(document).width()>1200)
        {
            if(!$side_nav.is(".active"))
            {
                $side_nav.addClass('active');
                $("#sidebarCollapse").addClass('active');
            }
        }else{
            if($side_nav.is(".active"))
            {
                $side_nav.removeClass('active');
                $("#sidebarCollapse").removeClass('active');
            }
        }
    }
});


/*----------------------------------------------------*/
/* parallax
------------------------------------------------------ */
function parallax() {
    var scrollPosition = $(window).scrollTop();
    $("#intro-bgc").css('margin-top', (0 - (scrollPosition * .8)) + 'px');
}


/*----------------------------------------------------*/
/* monitoring current state
------------------------------------------------------ */
document.addEventListener('scroll', function (event) {
    // console.log('scrolling', event.target);
    var scroll_pos = $(window).scrollTop();
    var view_height = $(window).height();
    parallax();
    // if($('.sec_page').offset().top scroll_pos == scroll_pos)
    // {
    $( ".sec_page" ).each(function(index) {
        elem = $(this);
        // if((scroll_pos - elem.offset().top) > - view_height/2 && (scroll_pos - elem.offset().top) < view_height/2)
        // console.log(index+ " - [" + elem.offset().top +","+ scroll_pos +" ]");
    });
    // }
}, true /*Capture event*/);

/*----------------------------------------------------*/
/* Navbar Smooth Scroll TODO: Fix!!
------------------------------------------------------ */
//  jQuery for page scrolling feature - requires jQuery Easing plugin
// $(function() {
//     $('a.page-scroll').bind('click', function(event) {
//         var $anchor = $(this);
//         $('html, body').stop().animate({
//             scrollTop: $($anchor.attr('href')).offset().top
//         }, 1500, 'easeInOutExpo');
//         event.preventDefault();
//     });
// });

/*----------------------------------------------------*/
/* Initializing jQuery Nice Scroll
------------------------------------------------------ */

// $("body").niceScroll({
//     bouncescroll:"",
//     cursorcolor:"#11abb0", // Set cursor color
//     cursorwidth: "8", // Sety cursor width
//     cursorborder: "" // Set cursor border color, default left none
// });

//TODO: Nice Scroll is so laggy !! Disabled for now
// $("#view-area").niceScroll("#view-area .nice-scroll-wrapper",{
//     cursorcolor:"black",
//     boxzoom:true,
//     bouncescroll: false,
//     mousescrollstep: 15,
//     cursorwidth: "8" // Sety cursor width
// });

