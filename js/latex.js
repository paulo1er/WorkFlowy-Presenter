(function(){
  var delimiters_inline = [["$", "$"]];
  var delimiters_display = [["\\[", "\\]"]];
  var delimiters = delimiters_inline.concat(delimiters_display);
  // 1. custom mathjax configuration
  var s = document.createElement('script');
  s.type = "text/x-mathjax-config";
  s.text =
  'MathJax.Hub.Config({\
    showProcessingMessages: false,\
    preview : "none",\
    tex2jax: {\
      inlineMath: ' + JSON.stringify(delimiters_inline) + ',\
      displayMath: ' + JSON.stringify(delimiters_display) + ',\
      ignoreClass: "tex2jax_ignore" ,\
      processClass: "tex2jax_process",\
    }\
  });';
  (document.head||document.documentElement).appendChild(s);

  // 2. mathjax itself
  s = document.createElement('script');
  s.src = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-AMS_HTML";
  (document.head||document.documentElement).appendChild(s);

  function mathjaxHtmlToText(b) {
    b.find(".MathJax_Preview").remove();
    b.find(".MathJax_Display").remove();
    b.find(".MathJax").remove();

    b.find("script").each(function() {
      if ($(this).attr("type") == "math/tex" && delimiters_inline.length > 0) {
        $(this).replaceWith(delimiters_inline[0][0] + $(this).html() + delimiters_inline[0][1]) ;
      } else if ($(this).attr("type") == "math/tex; mode=display" && delimiters_display.length > 0) {
        $(this).replaceWith(delimiters_display[0][0] + $(this).html() + delimiters_display[0][1]) ;
      }
    });
    return b.html();
  }


  var timerRendering;
  function startRenderingLaTeX(){
      console.log("START Rendering LaTeX");
      if (timerRendering) {
        clearInterval(timerRendering);
      };
      var focus = READ_ONLY_MAIN_TREE ? null :  WF.focusedItem();
      if(focus) focus = $('[projectid='+focus.getId()+']>div>.content');
      timerRendering = setInterval(function(){
        focus = READ_ONLY_MAIN_TREE ? null : WF.focusedItem();
        if(focus) focus = $('[projectid='+focus.getId()+']>div>.content');

        $(".selected .content").each(function(){
          if(focus && (focus[0].isSameNode($(this)[0])) ) {
            focus.removeClass("tex2jax_process").addClass("tex2jax_ignore");
            mathjaxHtmlToText($(this));
          }
          else if($("#pasteBucket").text() == ''){
            $(this).removeClass("tex2jax_ignore").addClass("tex2jax_process");
          }
        });

        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
      }, 100);
  }

  function stopRenderingLaTeX(){
    console.log("STOP Rendering LaTeX");
    if (timerRendering) {
      clearInterval(timerRendering);
    };
    timerRendering = setInterval(function(){
      $(".selected .content").each(function(){
        $(this).addClass("tex2jax_ignore").removeClass("tex2jax_process");
        mathjaxHtmlToText($(this));
      });
    }, 1000);
  }

  function ignoreParent(){
    setInterval(function(){
      $(".parent > .name > .content").each(function(){
        $(this).addClass("tex2jax_ignore").removeClass("tex2jax_process");
        mathjaxHtmlToText($(this));
      });
    }, 1000);
  }

  function initRenderingLaTeX(){
    var metaRender = $("[name=\'renderingLaTeX\']");
    var isRendering;
    if(!metaRender.length){
      metaRender = $("<meta>").attr("name", "renderingLaTeX").attr("content", "false");
      $("head").append(metaRender);
    }
    isRendering = metaRender.attr("content");
    ignoreParent();
    if(isRendering == "true")startRenderingLaTeX();
    else stopRenderingLaTeX();

    setInterval(function(){
      metaRender = $("[name=\'renderingLaTeX\']");
      if(isRendering != metaRender.attr("content")){
        isRendering = metaRender.attr("content");
        if(isRendering == "true") startRenderingLaTeX();
        else stopRenderingLaTeX();
      }
    }, 1000);
  }

  $(window).load(function() {
    initRenderingLaTeX();
  });

  var oldProjectIsMergeable = jQuery.fn.projectIsMergable;
  jQuery.fn.projectIsMergable = function(a) {
    var is_mergeable = oldProjectIsMergeable.apply(this, arguments);
    if (is_mergeable) {
      var focus = this.getName().children(".content");
      focus.removeClass("tex2jax_process").addClass("tex2jax_ignore");
      mathjaxHtmlToText(focus);
    }
    return is_mergeable;
  }

  var oldFunction = jQuery.fn.saveContent;
  jQuery.fn.saveContent = function() {
    mathjaxHtmlToText($(this));
    return oldFunction.apply(this, arguments);
  }

})();
