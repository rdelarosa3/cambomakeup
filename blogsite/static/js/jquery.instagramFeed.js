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
  $.instagramFeed = function (options) {
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

})(jQuery);