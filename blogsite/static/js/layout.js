//***** LANGUAGE TOGGLE *****
$(".lang").click(function(){
  $(".khmer-link").toggle();
  $(".eng-link").toggle();
});
//***** LANGUAGE TOGGLE *****

//***** LIGHTBOX *****
$(document).on('click', '[data-toggle="lightbox"]', function(event) {
    event.preventDefault();
    $(this).ekkoLightbox();
});
//***** END LIGHTBOX *****


//***** SCROLL ANIMATIONS *****
$(document).ready(function(){
	
	addAnimationData('#aboutImage','fadeInLeft','1000');
  	addAnimationData('#aboutText','fadeInRight','1100');
  	// gallery animations
  	addAnimationData('#galleryH2','fadeInUp','750');
  	addAnimationData('#galleryUl','fadeInUp','800');
  	// service animations
  	addAnimationData('#serviceH2','fadeInUp','750');
	addAnimationData('#serviceImage1','bounceIn','1000');
	addAnimationData('#serviceImage2','bounceIn','1250');
	addAnimationData('#serviceImage3','bounceIn','1500');
	// footer sroll animation
	addAnimationData('#footerScroll','fadeInUp','1000');
});
//***** END SCROLL ANIMATIONS *****

//***** BOOKING FRAME SECTION *****

// check if device is iOS
const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
$(document).ready(function(){
	// if device is ios open booiking in new window
	if (iOS){
		console.log('Apple Device');
		$('#pricingLink, #sideButton').removeAttr("data-toggle data-target");
		$('#pricingLink, #sideButton').click(function() {
		    window.open('https://cambomakeup.setmore.com/services','_blank');
		    return false;
		});
	}
	// if not ios open modal
	else{	
		$('#pricingLink, #sideButton').click(function(){
			// load iframe content src only on first click
			if ($('#bookingFrame').attr("src") == ""){ 
				$('#bookingFrame').attr("src","https://cambomakeup.setmore.com/services");
			}
			// loading effect
			$("#bookingFrame").hide();
			$(".pricing-loader").fadeIn('slow');
			$(".pricing-loader").delay(1900).fadeOut();
			$("#bookingFrame").delay(2400).fadeIn('slow');

		});			
	}
});

// reset booking frame
$('#resetBooking').click(function(){
	$('#bookingFrame').attr("src", $('#bookingFrame').attr("src"));
});

//******** END BOOKING FRAME SECTION ********
