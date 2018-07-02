(function(){

  function imageHtmlToText(b) {
    b.find("img").each(function() {
      $(this).parent().replaceWith('!['+$(this).attr("alt")+'](<a class="contentLink" target="_blank" rel="noreferrer" href="'+$(this).attr("src")+'">'+$(this).attr("src")+'</a>)') ;
    });
    return b.html();
  }

  var RegexImage = /!\[([-a-zA-Z0-9@:%_\+.~#?&//=\s]*)\]\(<a class="contentLink" target="_blank" rel="noreferrer" href="([-a-zA-Z0-9@:%_\+.~#?&//=]*)">([-a-zA-Z0-9@:%_\+.~#?&//=]*)<\/a>\)/g;
  function textToImageHtml(b) {
    if(RegexImage.test(b.html()))
      b.html(b.html().replace(RegexImage, "<a href='$2' class='image' target='_blank'><img src='$2' alt='$1' style='display: block;max-width:"+b.width()+"px;width: auto;height: auto;'></a>"));
    return b.html();
  }

  function videoHtmlToText(b) {
    b.find("iframe.video").each(function() {
      $(this).replaceWith('?['+$(this).attr("title")+'](<a class="contentLink" target="_blank" rel="noreferrer" href="'+$(this).attr("src")+'">'+$(this).attr("src")+'</a>)') ;
    });
    return b.html();
  }

  var RegexVideo = /\?\[([-a-zA-Z0-9@:%_\+.~#?&//=\s]*)\]\(<a class="contentLink" target="_blank" rel="noreferrer" href="([-a-zA-Z0-9@:%_\+.~#?&//=]*)">([-a-zA-Z0-9@:%_\+.~#?&//=]*)<\/a>\)/g;
  function textToVideoHtml(b) {
    if(RegexVideo.test(b.html()))
      b.html(b.html().replace(RegexVideo, "<iframe class='video' src='$2' title='$1' allowfullscreen></iframe>"));
    return b.html();
  }

  function linkHtmlToText(b) {
    b.find(".link").each(function() {
      $(this).replaceWith('['+$(this).text()+'](<a class="contentLink" target="_blank" rel="noreferrer" href="'+$(this).attr("href")+'">'+$(this).attr("href")+'</a>)') ;
    });
    return b.html();
  }

  var RegexLink = /\[([-a-zA-Z0-9@:%_\+.~#?&//=\s]*)\]\(<a class="contentLink" target="_blank" rel="noreferrer" href="([-a-zA-Z0-9@:%_\+.~#?&//=]*)">([-a-zA-Z0-9@:%_\+.~#?&//=]*)<\/a>\)/g;
  function textToLinkHtml(b) {
    if(RegexLink.test(b.html()))
      b.html(b.html().replace(RegexLink, "<a href='$2' class='contentLink link' target='_blank'>$1</a>"));
    return b.html();
  }

  var allEmoji = [];
  function emojiHtmlToText(b) {
    b.find(".em").each(function() {
      $(this).replaceWith(':'+$(this).attr('data-text')+':') ;
    });
    return b.html();
  }

  var RegexEmoji = /:([-a-z_0-9]*):/g;
  function textToEmojiHtml(b) {
    var result = "";
    var text = b.html();
    var match = RegexEmoji.exec(text);
    var i_prev = 0;
    while(match!=null){
      var i = match.index;
      if(i!=i_prev){
        result += text.slice(i_prev, i);
      }
      i_prev= RegexEmoji.lastIndex;
      if(allEmoji.includes(match[1])) {
        result += "<i class='em em-"+match[1]+"' data-text='"+match[1]+"'></i>"
      }
      else {
        result += ":"+match[1]+":"
      }
      match = RegexEmoji.exec(text);
    }
    if(text.length!=i_prev){
      result += text.slice(i_prev, text.length);
    }

    if(result != b.html())
      b.html(result);
    return b.html();
  }

  var timerRendering;
  function startRenderingImage(){
      console.log("START Rendering Image");
      if (timerRendering) {
        clearInterval(timerRendering);
      };
      var focus = READ_ONLY_MAIN_TREE ? null : getCurrentlyFocusedContent();
      timerRendering = setInterval(function(){
        focus = READ_ONLY_MAIN_TREE ? null : getCurrentlyFocusedContent();
        $(".selected .content").each(function(){
          if(focus && (focus[0].isSameNode($(this)[0]))) {
            imageHtmlToText($(this));
            videoHtmlToText($(this));
            linkHtmlToText($(this));
            emojiHtmlToText($(this));
          }
          else if($("#pasteBucket").text() == ''){
            textToImageHtml($(this));
            textToVideoHtml($(this));
            textToLinkHtml($(this));
            textToEmojiHtml($(this));
          }
        });
      }, 100);
  }

  function stopRenderingImage(){
    console.log("STOP Rendering Image");
    if (timerRendering) {
      clearInterval(timerRendering);
    };
    timerRendering = setInterval(function(){
      $(".selected .content").each(function(){
        imageHtmlToText($(this));
        videoHtmlToText($(this));
        linkHtmlToText($(this));
        emojiHtmlToText($(this));
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

    var cssSheet = $('#emojiCSS');
    (function initAllEmoji(){
      if(!cssSheet[0])
        setInterval(function(){
          cssSheet = $('#emojiCSS');
          initAllEmoji();
        }, 1000);
      else{
        $.when($.get(cssSheet[0].href))
        .done(function(response) {
          allEmoji = response.replace(/{([^\}]*)}/g, '').replace(/\,/g, '').replace(/\.em-svg\.em-([^\.]*)/g, '').split('.em-');
        });
      }
    })();

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
      videoHtmlToText(focus);
      linkHtmlToText(focus);
      emojiHtmlToText(focus);
    }
    return is_mergeable;
  }

  var oldGetTextForContent = content_text.getTextForContent;
  content_text.getTextForContent = function(e) {
    imageHtmlToText(e);
    videoHtmlToText(e);
    linkHtmlToText(e);
    emojiHtmlToText(e);
    return oldGetTextForContent.apply(this, arguments);
  }
})();
