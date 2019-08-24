//Update this function call with your own element ID, animate.css animation, and timeout in milliseconds. Each animated element requires its on function call.
//Supported animations are 'fadeInUp' 'flipInX' 'lightSpeedIn' 'bounceIn' 'slideInLeft' 'slideInRight' 'fadeInLeft' 'fadeInRight'. Other animations must be added on line 41 if used.
// addAnimationData('#services','bounceIn','1000');
//addAnimationData('#your-next-element','bounceIn','2000');

function addAnimationData(elem, elemData, elemTimeout) {
  $(elem).addClass("revealOnScroll").attr("data-animation",elemData).attr("data-timeout",elemTimeout);
}
$(function() {
  var $window           = $(window),
      win_height_padded = $window.height() * 1.1,
      isTouch           = Modernizr.touch;
  if (isTouch) { $('.revealOnScroll').addClass('animated'); }
  $window.on('scroll', revealOnScroll);
  function revealOnScroll() {
    var scrolled = $window.scrollTop(),
        win_height_padded = $window.height() * 1.1;
    // Showed...
    $(".revealOnScroll:not(.animated)").each(function () {
      var $this     = $(this),
          offsetTop = $this.offset().top;
      if (scrolled + win_height_padded > offsetTop) {
        if ($this.data('timeout')) {
          window.setTimeout(function(){
            $this.addClass('animated ' + $this.data('animation'));
          }, parseInt($this.data('timeout'),10));
        } else {
          $this.addClass('animated ' + $this.data('animation'));
        }
      }
    });
    // Hidden...
   $(".revealOnScroll.animated").each(function (index) {
      var $this     = $(this),
          offsetTop = $this.offset().top;
      if (scrolled + win_height_padded < offsetTop) {
        //add additional animate.css animations to the removeClass function
        $(this).removeClass('animated fadeInUp flipInX lightSpeedIn bounceIn slideInLeft slideInRight fadeInLeft fadeInRight')
      }
    });
  }
  revealOnScroll();
});