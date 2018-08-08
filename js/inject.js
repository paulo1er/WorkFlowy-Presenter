function initURLchange(){
  var handler = function(){};

  var metaShortcutNext = $("[name=\'shortcutNext\']");
  if(!metaShortcutNext.length){
    metaShortcutNext = $("<meta>").attr("name", "shortcutNext");
    $("head").append(metaShortcutNext);
  }
  var shortcutNextSTR = metaShortcutNext.attr("content");
  var shortcutNext = [null, null];
  if(shortcutNextSTR!="") shortcutNext = JSON.parse(metaShortcutNext.attr("content"));

  setInterval(function(){
    metaShortcutNext = $("[name=\'shortcutNext\']")
    if(shortcutNextSTR != metaShortcutNext.attr("content") ){
      shortcutNextSTR = metaShortcutNext.attr("content");
      if(shortcutNextSTR!="") shortcutNext = JSON.parse(metaShortcutNext.attr("content"));
    }
  }, 1000);

  var metaShortcutPrevious = $("[name=\'shortcutPrevious\']");
  if(!metaShortcutPrevious.length){
    metaShortcutPrevious = $("<meta>").attr("name", "shortcutPrevious");
    $("head").append(metaShortcutPrevious);
  }
  var shortcutPreviousSTR = metaShortcutPrevious.attr("content");
  var shortcutPrevious = [null, null];
  if(shortcutPreviousSTR!="") shortcutPrevious = JSON.parse(metaShortcutPrevious.attr("content"));

  setInterval(function(){
    metaShortcutPrevious = $("[name=\'shortcutPrevious\']")
    if(shortcutPreviousSTR != metaShortcutPrevious.attr("content") ){
      shortcutPreviousSTR = metaShortcutPrevious.attr("content");
      if(shortcutPreviousSTR!="") shortcutPrevious = JSON.parse(metaShortcutPrevious.attr("content"));
    }
  }, 1000);



  waitLoad(function(){
    try {
      handler = $(window).data("events").keydown[0].handler;

      $("*").keydown(function(e){
        if (eventEqualKey(e, shortcutNext[0]) || eventEqualKey(e, shortcutNext[1])) {
          handler({
            which:48,
            charCode:0,
            ctrlKey:true,
            keyCode:48,
            shiftKey:true,
            type:"keydown",
          });
          event.preventDefault();
          event.stopPropagation();
        }
        if (eventEqualKey(e, shortcutPrevious[0]) || eventEqualKey(e, shortcutPrevious[1])) {
          handler({
            which:57,
            charCode:0,
            ctrlKey:true,
            keyCode:48,
            shiftKey:true,
            type:"keydown",
          });
          event.preventDefault();
          event.stopPropagation();
        }
      })
    }
    catch(err) {clearInterval(interval); console.warn("previous and next siblings doesn't work\n", err)}
  });
}

$(window).load(function() {
  initURLchange()
  initLockUnlock();
  initNoAnimation();
});

function eventEqualKey(e, key){
  return key && (e.keyCode == key.keyCode) && (e.ctrlKey == key.ctrlKey) && (e.shiftKey == key.shiftKey) && (e.altKey == key.altKey);
}

function waitLoad(callback){
  if($('.selected').length){
    callback();
  }
  else
    setTimeout(function(){
      waitLoad(callback);
    }, 1000);

}



function initLockUnlock(){
  var metaLock = $("[name='lock']");
  var isLock, isPresenter;
  if(!metaLock.length){
    metaLock = $("<meta>").attr("name", "lock").attr("content", "false");
    $("head").append(metaLock);
  }
  isLock = metaLock.attr("content");
  isPresenter = $("#styleCSS").length;
  if(isLock == "true" && isPresenter) READ_ONLY_MAIN_TREE = true;
  else  READ_ONLY_MAIN_TREE = false;
  console.log("Lock contentent : " + READ_ONLY_MAIN_TREE);

  setInterval(function(){
    metaLock = $("[name='lock']");
    if((isLock != metaLock.attr("content")) || (isPresenter != $("#styleCSS").length)){
      isLock = metaLock.attr("content");
      isPresenter = $("#styleCSS").length;
      if(isLock == "true" && isPresenter) READ_ONLY_MAIN_TREE = true;
      else  READ_ONLY_MAIN_TREE = false;
      console.log("Lock contentent : " + READ_ONLY_MAIN_TREE);
    }
  }, 1000);
}



function initNoAnimation(){
  var metaAnime = $("[name='isAnimated']");
  var isAnimated;
  if(!metaAnime.length){
    metaAnime = $("<meta>").attr("name", "isAnimated").attr("content", "true");
    $("head").append(metaAnime);
  }
  isAnimated = metaAnime.attr("content");
  if(isAnimated == "false") NO_ANIMATIONS = true;
  else  NO_ANIMATIONS = false;
  console.log("NO_ANIMATIONS : " + NO_ANIMATIONS);

  setInterval(function(){
    metaAnime = $("[name='isAnimated']");
    if(isAnimated != metaAnime.attr("content")){
      isAnimated = metaAnime.attr("content");
      if(isAnimated == "false") NO_ANIMATIONS = true;
      else  NO_ANIMATIONS = false;
      console.log("NO_ANIMATIONS : " + NO_ANIMATIONS);
    }
  }, 1000);
}
