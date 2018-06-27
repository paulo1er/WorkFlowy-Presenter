(function(){
  function imageHtmlToText(b) {
    b.find("img").each(function() {
      $(this).replaceWith('!['+$(this).attr("alt")+'](<a class="contentLink" target="_blank" rel="noreferrer" href="'+$(this).attr("src")+'">'+$(this).attr("src")+'</a>)') ;
    });
    return b.html();
  }

  RegexImage = /!\[([-a-zA-Z0-9@:%_\+.~#?&//=\s]*)\]\(<a class="contentLink" target="_blank" rel="noreferrer" href="([-a-zA-Z0-9@:%_\+.~#?&//=]*)">([-a-zA-Z0-9@:%_\+.~#?&//=]*)<\/a>\)/g;
  function textToImageHtml(b) {
    if(RegexImage.test(b.html()))
      b.html(b.html().replace(RegexImage, "<img src='$2' alt='$1' style='display: block;max-width:"+b.width()+"px;width: auto;height: auto;'>"));
    return b.html();
  }

  var timerRendering;
  function startRenderingImage(){
      console.log("START !");
      if (timerRendering) {
        clearInterval(timerRendering);
      };
      var focus = READ_ONLY_MAIN_TREE ? null : getCurrentlyFocusedContent();
      timerRendering = setInterval(function(){
        focus = READ_ONLY_MAIN_TREE ? null : getCurrentlyFocusedContent();
        $(".selected .content").each(function(){
          if(focus && (focus[0].isSameNode($(this)[0])) ) {
            imageHtmlToText($(this));
          }
          else{
            textToImageHtml($(this));
          }
        });
      }, 100);
  }

  function stopRenderingImage(){
    console.log("STOP !");
    if (timerRendering) {
      clearInterval(timerRendering);
    };
    timerRendering = setInterval(function(){
      $(".selected .content").each(function(){
        imageHtmlToText($(this));
      });
    }, 1000);
  }


  function initRenderingImage(){
    var metaRender = $("[name=\'renderingImage\']");
    var isRendering;
    if(!metaRender.length){
      metaRender = $("<meta>").attr("name", "renderingImage").attr("content", "false");
      $("head").append(metaRender);
    }
    isRendering = metaRender.attr("content");
    if(isRendering == "true") startRenderingImage();
    else stopRenderingImage();

    setInterval(function(){
      metaRender = $("[name=\'renderingImage\']");
      if(isRendering != metaRender.attr("content")){
        isRendering = metaRender.attr("content");
        if(isRendering == "true") startRenderingImage();
        else stopRenderingImage();
      }
    }, 1000);
  }

  $(window).load(function() {
    initRenderingImage();
  });

  var oldProjectIsMergeable2 = jQuery.fn.projectIsMergable;
  jQuery.fn.projectIsMergable = function(a) {
      var is_mergeable = oldProjectIsMergeable2.apply(this, arguments);
      if (is_mergeable) {
        var focus = this.getName().children(".content");
        imageHtmlToText(focus);
      }
      return is_mergeable;
  }
})();
