if (location.pathname === "/" || "homepage"){
//*********************** Navbar Links Scrolling ***********************	
	console.log(location.pathname);
	// scroll effects for button
	$("#floating-button").click(function() {
		$('html, body').animate({
			scrollTop: $("#about").offset().top
		}, 1500);
	});

	// scroll effects for button
	$("#galleryNav").click(function(event) {
		event.preventDefault();
		$('html, body').animate({
			scrollTop: $("#gallery").offset().top
		}, 1500);
	});
	// scroll effects for button
	$("#servicesNav").click(function(event) {
		event.preventDefault();
		$('html, body').animate({
			scrollTop: $("#services").offset().top
		}, 1500);
	});

	// shift between languages 
	$( document ).ready(function() {
		$(".khmer-link").toggle();
		$(".eng-link").toggle();
	});

//*********************** INSTAGRAM GALLERY SECTION ***********************
	// instagram gallery scroll effect
	function galleryScroll(){
		let count = 1000;

		for(var a=1; a <= $('#gallery img').length; a++){
			addAnimationData('#gal'+a.toString(),'bounceIn',count.toString());
			count+=250;
		}
	}

	// force screen scroll to animate effect
	function animateScroll(){
		$('html, body').animate({
			scrollTop: $("#serviceImage3").offset().top
		},500);
		$('html, body').animate({
			scrollTop: $("#gallery").offset().top
		},5000);
	}

	// instagram gallery
	$(document).ready(function(){
		$(".instagram_feed").fadeOut("slow");
		$(".loader").delay(400).fadeIn('slow');
		$.instagramFeed({
			'tag': "cambomakeup",
			'container': ".instagram-feed",
			'alt_tag': "cambodia makeup",
			'styling': false,
			'display_gallery': true,
			'items': 18,
			'items_per_row': 10,
			'margin': 0,
			'lazy_load': true,
			'callback': null,
			'on_error': console.error
		});
		$(".loader").delay(4300).fadeOut();
		$(".instagram_feed").delay(5000).fadeIn('slow');
		setTimeout(galleryScroll,5200);
	});

	const links = {'#weddingStyle':'khmerwedding',
		'#eveningStyle':'eveningmakeup',
		'#viewStyle':'cambomakeup'
	};

	$.each( links, function( key, value ) {
		$(key).click(function(){
			console.log( key + ": " + value );
			$(".instagram_feed").fadeOut();
			$(".loader").delay(400).fadeIn('slow');
			$.instagramFeed({
				'tag': value,
				'container': ".instagram-feed",
				'alt_tag': "cambodia makeup",
				'styling': false,
				'display_gallery': true,
				'items': 18,
				'items_per_row': 10,
				'margin': 0,
				'lazy_load': true,
				'callback': null,
				'on_error': console.error
			});
			$(".loader").delay(4300).fadeOut();
			$(".instagram_feed").delay(5000).fadeIn('slow');
			setTimeout(galleryScroll,5500);
			setTimeout(animateScroll,5500);
		});
	});
//*********************END INSTAGRAM GALLERY SECTION ***********************
}


    // (function($){
    //     $(window).on('load', function(){
    //         $.instagramFeed({
    //             'username': 'instagram',
    //             'container': "#instagram-feed1",
    //             'display_profile': true,
    //             'display_biography': true,
    //             'display_gallery': true,
    //             'callback': null,
    //             'styling': true,
    //             'items': 8,
    //             'items_per_row': 4,
    //             'margin': 1,
    //             'lazy_load': true,
    //             'on_error': console.error
    //         });
    //     });
    // })(jQuery);