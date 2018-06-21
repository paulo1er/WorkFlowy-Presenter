
var delimiters_inline = [["$", "$"]];
var delimiters_display = [["\\[", "\\]"]];
var delimiters = delimiters_inline.concat(delimiters_display);
// 1. custom mathjax configuration
var s = document.createElement('script');
s.type = "text/x-mathjax-config";
s.text = 'MathJax.Hub.Config({\
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
  return b.html().replace(/&lt;/ig, "<").replace(/&gt;/ig, ">").replace(/&nbsp;/ig, "\u00a0").replace(/&amp;/ig, "&");
}


var timerRendering;
function startRendering(){
    console.log("START !");
    if (timerRendering) {
      clearInterval(timerRendering);
    };
    var focus = READ_ONLY_MAIN_TREE ? null : getCurrentlyFocusedContent();
    var prev_focus = focus;
    timerRendering = setInterval(function(){
      focus = READ_ONLY_MAIN_TREE ? null : getCurrentlyFocusedContent();
      if(focus != prev_focus){
        prev_focus = focus;
        $(".selected .content").removeClass("tex2jax_ignore").addClass("tex2jax_process");
        if(focus) {
          focus.removeClass("tex2jax_process").addClass("tex2jax_ignore");
          mathjaxHtmlToText(focus);
        }
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
      }
    }, 10);
}

function stopRendering(){
  console.log("STOP !");
  if (timerRendering) {
    clearInterval(timerRendering);
  };
  $(".selected .content").each(function(){
    $(this).addClass("tex2jax_ignore").removeClass("tex2jax_process");
    mathjaxHtmlToText($(this));
  });
}

function initRendering(){
  var metaRender = $("[name=\'rendering\']");
  var isRendering;
  if(!metaRender.length){
    metaRender = $("<meta>").attr("name", "rendering").attr("content", "false");
    $("head").append(metaRender);
  }
  isRendering = metaRender.attr("content");
  if(isRendering == "true")startRendering();
  else stopRendering();

  setInterval(function(){
    metaRender = $("[name=\'rendering\']");
    if(isRendering != metaRender.attr("content")){
      isRendering = metaRender.attr("content");
      if(isRendering == "true")startRendering();
      else stopRendering();
    }
  }, 1000);
}

$(window).load(function() {
  initRendering();
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
