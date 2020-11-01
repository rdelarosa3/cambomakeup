/*!
 * jquery.instagramFeed
 *
 * @version 1.1
 *
 * @author Javier Sanahuja Liebana <bannss1@gmail.com>
 *
 * https://github.com/jsanahuja/jquery.instagramFeed
 *
 */
// # Place all the behaviors and hooks related to the matching controller here.
// # All this logic will automatically be available in application.js.
// # You can use CoffeeScript in this file: http://coffeescript.org/
(function($){
  var defaults = {
    'host': "https://www.instagram.com/",
    'username': '',
    'container': '',
    'display_gallery': true,
    'get_raw_json': false,
    'callback': null,
    'styling': true,
    'items': 8,
    'items_per_row': 4,
    'margin': 0.5
  };

  var escape_map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };
  function escape_string(str) {
    return str.replace(/[&<>"'`=\/]/g, function (char) {
      return escape_map[char];
    });
  }
  $.instagramFeed = function (opts) {
    var options = $.fn.extend({}, defaults, opts);
    if (options.username == "" && options.tag == "") {
      console.error("Instagram Feed: Error, no username or tag found.");
      return false;
    }
    if (typeof options.get_raw_json !== "undefined") {
      console.warn("Instagram Feed: get_raw_json is deprecated. Leave options.container undefined instead of setting options.get_raw_json to true");
    }
    if (typeof options.get_data !== "undefined") {
      console.warn("Instagram Feed: options.get_data is deprecated. Leave options.container undefined instead of setting options.get_data to true");
    }
    if (options.callback == null && options.container == "") {
      console.error("Instagram Feed: Error, neither container found nor callback defined.");
      return false;
    }
    var is_tag = options.username == "",
        url = is_tag ? options.host + "explore/tags/" + options.tag + "/" : options.host + options.username + "/";

    $.get(url, function (data) {
      try {
        data = data.split("window._sharedData = ")[1].split("<\/script>")[0];
      } catch (e) {
        console.error("Instagram Feed: It looks like the profile you are trying to fetch is age restricted. See https://github.com/jsanahuja/InstagramFeed/issues/26");
        return;
      }
      data = JSON.parse(data.substr(0, data.length - 1));
      data = data.entry_data.ProfilePage || data.entry_data.TagPage;
      if (typeof data === "undefined") {
        console.error("Instagram Feed: It looks like YOUR network has been temporary banned because of too many requests. See https://github.com/jsanahuja/jquery.instagramFeed/issues/25");
        return;
      }
      data = data[0].graphql.user || data[0].graphql.hashtag;

      if (options.container != "") {

        var styles = {
          'gallery_image': ""
        };

        if(options.styling){
          var width = (100 - options.margin * 2 * options.items_per_row)/options.items_per_row;
          styles.gallery_image = " style='margin:"+options.margin+"% "+options.margin+"%;width:"+width+"%;'";
        }

        var html = "";
        if(options.display_gallery){
          if (typeof data.is_private !== "undefined" && data.is_private === true) {
            html += "<p class='instagram_private'><strong>This profile is private</strong></p>";
          }
          else {
            var imgs = (data.edge_owner_to_timeline_media || data.edge_hashtag_to_media).edges;
            max = (imgs.length > options.items) ? options.items : imgs.length;
            html += '<div class="row no-gutters">';
            count = 1
            for(var i = 0; i < max; i++){
              var url = "https://www.instagram.com/p/"+ imgs[i].node.shortcode,image, type_resource, caption;
              switch (imgs[i].node.__typename) {
                case "GraphSidecar":
                  type_resource = "sidecar"
                  image = imgs[i].node.thumbnail_resources[image_index].src;
                  break;
                case "GraphVideo":
                  type_resource = "video";
                  image = imgs[i].node.thumbnail_src
                  break;
                default:
                  type_resource = "image";
                  image = imgs[i].node.thumbnail_resources[image_index].src;
              }

              if (
                  typeof imgs[i].node.edge_media_to_caption.edges[0] !== "undefined" &&
                  typeof imgs[i].node.edge_media_to_caption.edges[0].node !== "undefined" &&
                  typeof imgs[i].node.edge_media_to_caption.edges[0].node.text !== "undefined" &&
                  imgs[i].node.edge_media_to_caption.edges[0].node.text !== null
              ) {
                caption = imgs[i].node.edge_media_to_caption.edges[0].node.text;
              } else if (
                  typeof imgs[i].node.accessibility_caption !== "undefined" &&
                  imgs[i].node.accessibility_caption !== null
              ) {
                caption = imgs[i].node.accessibility_caption;
              } else {
                caption = (is_tag ? data.name : data.username) + " image " + i;
              }
              html += "<div class='col-xs-3 col-sm-3 col-md-2 col-lg-2 item zoom-on-hover' id='gal"+count+"'>";
              html += "<a data-lightbox='inks' href='"+ imgs[i].node.thumbnail_src +"'> <img src='"+ imgs[i].node.thumbnail_src +"' alt='"+ options.username +" instagram image "+ i+"'"+styles.gallery_image+" class='img-fluid image ink-image'/></a></div>";
              count += 1;
            }
            html += "</div>";
          }
        }
        $(options.container).html(html);
      }
      if (options.callback != null) {
        options.callback(data);
      }
    }).fail(function (e) {
      console.error("Instagram Feed: Unable to fetch the given user/tag. Instagram responded with the status code: ", e.status);
    });
    return true;
  };

})(jQuery);function addAnimationData(elem,elemData,elemTimeout){$(elem).addClass("revealOnScroll").attr("data-animation",elemData).attr("data-timeout",elemTimeout);}
$(function(){var $window=$(window),win_height_padded=$window.height()*1.1,isTouch=Modernizr.touch;if(isTouch){$('.revealOnScroll').addClass('animated');}
$window.on('scroll',revealOnScroll);function revealOnScroll(){var scrolled=$window.scrollTop(),win_height_padded=$window.height()*1.1;$(".revealOnScroll:not(.animated)").each(function(){var $this=$(this),offsetTop=$this.offset().top;if(scrolled+win_height_padded>offsetTop){if($this.data('timeout')){window.setTimeout(function(){$this.addClass('animated '+$this.data('animation'));},parseInt($this.data('timeout'),10));}else{$this.addClass('animated '+$this.data('animation'));}}});$(".revealOnScroll.animated").each(function(index){var $this=$(this),offsetTop=$this.offset().top;if(scrolled+win_height_padded<offsetTop){$(this).removeClass('animated fadeInUp flipInX lightSpeedIn bounceIn slideInLeft slideInRight fadeInLeft fadeInRight')}});}
revealOnScroll();});$(".lang").click(function(){$(".khmer-link").toggle();$(".eng-link").toggle();});$(document).on('click','[data-toggle="lightbox"]',function(event){event.preventDefault();$(this).ekkoLightbox();});$(document).ready(function(){addAnimationData('#aboutImage','fadeInLeft','1000');addAnimationData('#aboutText','fadeInRight','1100');addAnimationData('#galleryH2','fadeInUp','750');addAnimationData('#galleryUl','fadeInUp','800');addAnimationData('#serviceH2','fadeInUp','750');addAnimationData('#serviceImage1','bounceIn','1000');addAnimationData('#serviceImage2','bounceIn','1250');addAnimationData('#serviceImage3','bounceIn','1500');addAnimationData('#footerScroll','fadeInUp','1000');});const iOS=/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream;$(document).ready(function(){if(iOS){console.log('Apple Device');$('#pricingLink, #sideButton').removeAttr("data-toggle data-target");$('#pricingLink, #sideButton').click(function(){window.open('https://cambomakeup.setmore.com/services','_blank');return false;});}
else{$('#pricingLink, #sideButton').click(function(){if($('#bookingFrame').attr("src")==""){$('#bookingFrame').attr("src","https://cambomakeup.setmore.com/services");}
$("#bookingFrame").hide();$(".pricing-loader").fadeIn('slow');$(".pricing-loader").delay(1900).fadeOut();$("#bookingFrame").delay(2400).fadeIn('slow');});}});$('#resetBooking').click(function(){$('#bookingFrame').attr("src",$('#bookingFrame').attr("src"));});if (location.pathname === "/" || "homepage"){
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
			'username': '',
			'tag': 'cambomakeup',
			'container': ".instagram-feed",
			'alt_tag': "cambodia makeup",
			'styling': false,
			'display_gallery': true,
			'items': 18,
			'items_per_row': 10,
			'margin': 0
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
				'username': '',
				'tag': value,
				'container': ".instagram-feed",
				'alt_tag': "cambodia makeup",
				'styling': false,
				'display_gallery': true,
				'items': 18,
				'items_per_row': 10,
				'margin': 0
			});
			$(".loader").delay(4300).fadeOut();
			$(".instagram_feed").delay(5000).fadeIn('slow');
			setTimeout(galleryScroll,5500);
			setTimeout(animateScroll,5500);
		});
	});
//*********************END INSTAGRAM GALLERY SECTION ***********************
}