(function(){

  function imageHtmlToText(b) {
    b.find("a.markdownImage").each(function() {
      var img = $(this).children("img");
      $(this).replaceWith('!['+img.attr("alt")+'](<a class="contentLink" target="_blank" rel="noreferrer" href="'+img.attr("src")+'">'+img.attr("src")+'</a>)') ;
    });
    return b.html();
  }

  var regexImage = /!\[([-a-zA-Z0-9@:%_\+.~#?&//=\s]*)\]\(<a class="contentLink" target="_blank" rel="noreferrer" href="([-a-zA-Z0-9@:%_\+.~#?&//=]*)">([-a-zA-Z0-9@:%_\+.~#?&//=]*)<\/a>\)/g;
  function textToImageHtml(b) {
    if(regexImage.test(b.html()))
      b.html(b.html().replace(regexImage, "<a href='$2' class='markdownImage' target='_blank'><img src='$2' alt='$1' style='display: block;max-width:"+b.width()+"px;width: auto;height: auto;'></a>"));
    return b.html();
  }

  function videoHtmlToText(b) {
    b.find("iframe.markdownVideo").each(function() {
      $(this).replaceWith('?['+$(this).attr("title")+'](<a class="contentLink" target="_blank" rel="noreferrer" href="'+$(this).attr("src")+'">'+$(this).attr("src")+'</a>)') ;
    });
    return b.html();
  }

  var regexVideo = /\?\[([-a-zA-Z0-9@:%_\+.~#?&//=\s]*)\]\(<a class="contentLink" target="_blank" rel="noreferrer" href="([-a-zA-Z0-9@:%_\+.~#?&//=]*)">([-a-zA-Z0-9@:%_\+.~#?&//=]*)<\/a>\)/g;
  function textToVideoHtml(b) {
    if(regexVideo.test(b.html()))
      b.html(b.html().replace(regexVideo, "<iframe class='markdownVideo' src='$2' title='$1' allowfullscreen style='display:block;'></iframe>"));
    return b.html();
  }

  function linkHtmlToText(b) {
    b.find("a.markdownLink").each(function() {
      $(this).replaceWith('['+$(this).text()+'](<a class="contentLink" target="_blank" rel="noreferrer" href="'+$(this).attr("href")+'">'+$(this).attr("href")+'</a>)') ;
    });
    return b.html();
  }

  var regexLink = /\[([-a-zA-Z0-9@:%_\+.~#?&//=\s]*)\]\(<a class="contentLink" target="_blank" rel="noreferrer" href="([-a-zA-Z0-9@:%_\+.~#?&//=]*)">([-a-zA-Z0-9@:%_\+.~#?&//=]*)<\/a>\)/g;
  function textToLinkHtml(b) {
    if(regexLink.test(b.html()))
      b.html(b.html().replace(regexLink, "<a href='$2' class='contentLink markdownLink' target='_blank'>$1</a>"));
    return b.html();
  }

  var allEmoji = [];
  function emojiHtmlToText(b) {
    b.find(".em").each(function() {
      $(this).replaceWith(':'+$(this).attr('data-text')+':') ;
    });
    return b.html();
  }

  var regexEmoji = /:([-a-z_0-9]*):/g;
  function textToEmojiHtml(b) {
    var result = "";
    var text = b.html();
    var match = regexEmoji.exec(text);
    var i_prev = 0;
    while(match!=null){
      var i = match.index;
      if(i!=i_prev){
        result += text.slice(i_prev, i);
      }
      i_prev= regexEmoji.lastIndex;
      if(allEmoji.includes(match[1])) {
        result += "<i class='em em-"+match[1]+"' data-text='"+match[1]+"'></i>"
      }
      else {
        result += ":"+match[1]+":"
      }
      match = regexEmoji.exec(text);
    }
    if(text.length!=i_prev){
      result += text.slice(i_prev, text.length);
    }

    if(result != b.html())
      b.html(result);
    return b.html();
  }

  var timerRendering;
  function startRenderingMarkdown(){
      console.log("START Rendering Markdown");
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

  function stopRenderingMarkdown(){
    console.log("STOP Rendering Markdown");
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


  function initRenderingMarkdown(){
    var metaRender = $("[name=\'renderingMarkdown\']");
    var isRendering;
    if(!metaRender.length){
      metaRender = $("<meta>").attr("name", "renderingMarkdown").attr("content", "false");
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

    if(isRendering == "true") startRenderingMarkdown();
    else stopRenderingMarkdown();

    setInterval(function(){
      metaRender = $("[name=\'renderingMarkdown\']");
      if(isRendering != metaRender.attr("content")){
        isRendering = metaRender.attr("content");
        if(isRendering == "true") startRenderingMarkdown();
        else stopRenderingMarkdown();
      }
    }, 1000);
  }

  $(window).load(function() {
    initRenderingMarkdown();
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
