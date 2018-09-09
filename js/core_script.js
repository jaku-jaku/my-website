  /*----------------------------------------------------*/
  /* Html bridge
  ------------------------------------------------------ */
$(function(){
    $("#contactSection").load("sub_mod/contact.html");
});

$(function(){
    $("#projectSection").load("sub_mod/Projects.html");
});


  /*----------------------------------------------------*/
  /* TODO Owl Demo
  ------------------------------------------------------ */
$(document).ready(function() {
  $(".owl-demo").owlCarousel({
    navigation:true,
    navigationText:["<span class='angle'></span>","<span class='angle'></span>"],
    singleItem : true,
    autoHeight : true,
    transitionStyle:"fade"
  });
});

  /*----------------------------------------------------*/
  /* AUTO portfolio card gen
  ------------------------------------------------------ */
$(function () {
    $.getJSON("sub_mod/pfo_projects.json",
        function (json) {
            var pfo_elem;
            for (var i = 0; i < json.length; i++) {
                pfo_elem = "";
                pfo_elem += " <li class=\"pfo-item\">\n" +
                    "<div class=\"card col-lg-6 col-md-6 col-xs-12 col-sm-6\" id=\"" + json[i].id_name + "\">" +
                    "<a href=\"#portfolioModal1\"  data-toggle=\"modal\"   style=\"color:black; outline:0;\">" +
                    " <span class=\"card-pic\">\n" +
                    "      <img src=\""+ json[i].img_src + "\" style=\"width:100%; padding-bottom:100px;\"/>\n" +
                    "      <div class=\"card-description\">\n" +
                    "      <div class=\"card-des-title\">\n" +
                            json[i].title+
                    "      </div>\n" +
                    "      <div class=\"card-des-explain\">\n" +
                            json[i].description+
                    "      </div>\n" +
                    "      </div>\n" +
                    " </span>\n" +
                    "</a>\n" +
                    "</div>\n" +
                    "</li>";

                $('#pfo-bundle').append(pfo_elem);
            }
        });
});

  /*----------------------------------------------------*/
  /* Navbar Smooth Scroll
  ------------------------------------------------------ */
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


  /*----------------------------------------------------*/
  /* Responsive Menu Navbar
  ------------------------------------------------------ */
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
// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
  if ($(this).attr('class') != 'dropdown-toggle active' && $(this).attr('class') != 'dropdown-toggle') {
    $('.navbar-toggle:visible').click();
  }
});

  /*----------------------------------------------------*/
  /* parallax
  ------------------------------------------------------ */
$(window).scroll(function(e){
  parallax();
});

function parallax() {
  var scrollPosition = $(window).scrollTop();
  $("#intro-bgc").css('margin-top', (0 - (scrollPosition * .8)) + 'px');
}

  /*----------------------------------------------------*/
  /* Initializing jQuery Nice Scroll
  ------------------------------------------------------ */

$("body").niceScroll({
  bouncescroll:"",
  cursorcolor:"#11abb0", // Set cursor color
  cursorwidth: "8", // Sety cursor width
  cursorborder: "" // Set cursor border color, default left none
});

  /*----------------------------------------------------*/
  /* TODO Unknowns !!
  ------------------------------------------------------ */

// $('.filter li a').click(function(e) {
//   e.preventDefault();
//   var $this = $(this);
//   $('li').removeClass('activeL');
//   $this.parent().addClass('activeL');
//   // Filter
//   var te= document.getElementsByClassName('activeL');
//   var ac=$( te ).attr("datalist");
//   // console.log(ac);
//
//   var listItems = $("#workList li");
//   listItems.each(function() {
//     var dl=$(this).attr("class");
//     // console.log(dl);
//
//     if(ac!='*'){
//       // console.log(0);
//       if(dl!=ac){
//         // console.log(true);
//         $(this).fadeOut("slow");
//       }else{
//         $(this).fadeIn("slow");
//       }
//     }else{
//       $(this).fadeIn("slow");
//     }
//   });
//   //
//
//   e.preventDefault();
// });
//
// $('.pageclose').click(function () {
//   $('.modal').modal('toggle');
// });
//
// $('#lihuili').hover(function(){
//   $('#edulfs').toggleClass("linebf");
//   $('#edulfs').toggleClass("linebflihuili");
// });
// $('#loyola').hover(function(){
//   $('#edulfs').toggleClass("linebf");
//   $('#edulfs').toggleClass("linebfloyola");
// });
// $('#uw').hover(function(){
//   $('#edulfs').toggleClass("linebf");
//   $('#edulfs').toggleClass("linebfuw");
// });
