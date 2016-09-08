

// jQuery to collapse the navbar on scroll
function collapseNavbar() {
  if ($(".navbar").offset().top > 50) {
    $(".navbar-fixed-top").addClass("top-nav-collapse");
  } else {
    $(".navbar-fixed-top").removeClass("top-nav-collapse");
  }
}

$(window).scroll(collapseNavbar);
$(document).ready(collapseNavbar);

//owl-demo
$(document).ready(function() {

  $("#owl-demo").owlCarousel({
    navigation:true,
navigationText:["<span class='angle'></span>","<span class='angle'></span>"],
    singleItem : true,
    autoHeight : true,
    transitionStyle:"fade"
  });

});

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
  $('a.page-scroll').bind('click', function(event) {
    var $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: $($anchor.attr('href')).offset().top
    }, 1500, 'easeInOutExpo');
    event.preventDefault();
  });
});

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
  if ($(this).attr('class') != 'dropdown-toggle active' && $(this).attr('class') != 'dropdown-toggle') {
    $('.navbar-toggle:visible').click();
  }
});

// parallax
$(window).scroll(function(e){
  parallax();
});

function parallax() {
  var scrollPosition = $(window).scrollTop();
  $("#intro-bgc").css('margin-top', (0 - (scrollPosition * .8)) + 'px');
}

//   /*----------------------------------------------------*/
//   /* Initializing jQuery Nice Scroll
//   ------------------------------------------------------ */

$("body").niceScroll({
  bouncescroll:"",
  cursorcolor:"#11abb0", // Set cursor color
  cursorwidth: "8", // Sety cursor width
  cursorborder: "" // Set cursor border color, default left none
});

//   ------------------------------------------------------ */
