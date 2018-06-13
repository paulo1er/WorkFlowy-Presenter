
(function($){
    var arColors = ["red", "blue", "green", "yellow", "aqua", "black", "fuchsia", "gray", "lime", "maroon", "navy", "olive", "orange", "purple", "silver", "teal", "white"];
    var mode = "color";
    var prev_mode = mode;
    var isPresenter = true;
    var prev_isPresenter = isPresenter;
    var timerUpdateNodes;
    var updateNodes = function() {
        var TagTexts = $(".contentTagText");
        $.each(arColors, function(ind, val) {
            var class_name = "wfcolor-" + val;
            //if (prev_mode != mode) $("." + class_name).removeClass(class_name).css(prev_mode, "");
            var els = TagTexts.filter(function(index){return ($(this).text() === val);}).parent().parent();
            var elsChange = els.not("[style *= " + mode + "]").not("." + class_name);
            //var elsChange = els.not("." + class_name);
            elsChange.css(mode, val);
            if ((mode == "background-color") && (val != "yellow")) elsChange.css("color", "white");
            elsChange.addClass(class_name);
            $("." + class_name).not(els).removeClass(class_name).css(mode, "").css("color", "");
        });
        clearInterval(timerUpdateNodes);
    };
    var startTimer = function() {
      if (timerUpdateNodes) {
        clearInterval(timerUpdateNodes);
      };
      timerUpdateNodes = setInterval(updateNodes, 300);
    };
    function goParent() {
      var parentPath = $(".selected").parent().parent().children(".name").children(".bullet").attr("href");
      if(parentPath)
        location.href = parentPath;
      else
        location.href = "/#/";
    }
    var addCSS = function() {
      var path = chrome.extension.getURL('css/inject.css');
      $('head').append($('<link>')
          .attr("id","injectCSS")
          .attr("rel","stylesheet")
          .attr("type","text/css")
          .attr("href", path));
      $("#logo:not([class*='show'])").addClass("show");
      $("#searchForm:not([class*='show'])").addClass("show");
      $('#header').append($('<a>')
        .attr("id","goParent")
        .click(goParent)
        .text("<"));
    };
    var deleteCSS = function() {
      $('#injectCSS').remove();
      $('#goParent').remove();
    };
    var startWorking = function() {
      document.addEventListener("DOMNodeInserted", startTimer);
      if(isPresenter) addCSS(); else deleteCSS();
      chrome.storage.onChanged.addListener(function(changes, namespace) {
        if ("MarkerMode" in changes) {
          prev_mode = mode;
          mode = (changes.MarkerMode.newValue? "background-color": "color");
          if (prev_mode != mode) {
            $.each(arColors, function(ind, val) {
              var class_name = "wfcolor-" + val;
              $("." + class_name).removeClass(class_name).css({"color": "", "background-color": ""});
            })
          }
          startTimer();
        };
        if ("presenter" in changes) {
          prev_isPresenter = isPresenter;
          isPresenter = changes.presenter.newValue;
          if (prev_isPresenter != isPresenter) {
            if(isPresenter) addCSS();
            else deleteCSS();
          }
          startTimer();
        };
       });
    };
    var callbackGetValue = function(vals) {
      mode = (vals.MarkerMode? "background-color": "color");
      isPresenter = vals.presenter;
      startWorking();
    };
  chrome.storage.sync.get({"MarkerMode": true, "presenter":true}, callbackGetValue);

	chrome.runtime.sendMessage({
		type: 'showIcon'
	}, function() {});
}) (jQuery);
