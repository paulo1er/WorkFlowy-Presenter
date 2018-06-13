
(function($){
    var arColors = ["red", "blue", "green", "yellow", "aqua", "black", "fuchsia", "gray", "lime", "maroon", "navy", "olive", "orange", "purple", "silver", "teal", "white"];
    var mode = "color";
    var prev_mode = mode;
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
    var startWorking = function() {
      document.addEventListener("DOMNodeInserted", startTimer);
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
       });
    };
    var callbackGetValue = function(vals) {
      mode = (vals.MarkerMode? "background-color": "color");
      startWorking();
    };
  chrome.storage.sync.get({"MarkerMode": true}, callbackGetValue);
    
}) (jQuery);

