$(function(){
    $("#contactSection").load("contact.html");
});

$(function(){
    $("#portfolioSection").load("Portfolio.html");
});



$(window).scroll(collapseNavbar);
$(document).ready(collapseNavbar);


//owl-demo
$(document).ready(function() {
  $(".owl-demo").owlCarousel({
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

$('.filter li a').click(function(e) {
  e.preventDefault();
  var $this = $(this);
  $('li').removeClass('activeL');
  $this.parent().addClass('activeL');
  // Filter
  var te= document.getElementsByClassName('activeL');
  var ac=$( te ).attr("datalist");
  // console.log(ac);

  var listItems = $("#workList li");
  listItems.each(function() {
    var dl=$(this).attr("class");
    // console.log(dl);

    if(ac!='*'){
      // console.log(0);
      if(dl!=ac){
        // console.log(true);
        $(this).fadeOut("slow");
      }else{
        $(this).fadeIn("slow");
      }
    }else{
      $(this).fadeIn("slow");
    }
  });
  //

  e.preventDefault();
});

$('.pageclose').click(function () {
  $('.modal').modal('toggle');
});

$('#lihuili').hover(function(){
  $('#edulfs').toggleClass("linebf");
  $('#edulfs').toggleClass("linebflihuili");
});
$('#loyola').hover(function(){
  $('#edulfs').toggleClass("linebf");
  $('#edulfs').toggleClass("linebfloyola");
});
$('#uw').hover(function(){
  $('#edulfs').toggleClass("linebf");
  $('#edulfs').toggleClass("linebfuw");
});
