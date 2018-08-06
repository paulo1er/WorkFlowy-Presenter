function initURLchange(){
  var oldURL = "";
  var currentURL = window.location.href;
  $("head").append($("<meta>").attr("name", "urlPrevious").attr("content", ""));
  $("head").append($("<meta>").attr("name", "urlNext").attr("content", ""));
  waitLoad(function(){
    var interval = setInterval(function(){
      try {currentURL = window.location.href; checkURLchange(oldURL, currentURL); oldURL = currentURL;}
      catch(err) {clearInterval(interval); console.warn("previous and next siblings doesn't work\n", err)}
    }, 1000);
  });
}

function checkURLchange(oldURL, currentURL){
  if(currentURL != oldURL){
    /*
    var selected = $(".selected").getProject();
    console.log(selected);
    var urlPrevious="";
    var urlNext="";

    var previous = selected.getPreviousProject();
    if (previous != null){
      console.log("previous", previous);
      //var temp =  previous.projectid.split("-");
      //urlPrevious = "https://workflowy.com/#/" + temp[temp.length-1];
    }

    var next = selected.next();
    if (next != null){
      console.log("next", next);
      //var temp =  next.projectid.split("-");
      //urlNext = "https://workflowy.com/#/" + temp[temp.length-1];
    }
    $("[name=\'urlPrevious\']").attr("content", urlPrevious);
    $("[name=\'urlNext\']").attr("content", urlNext);
    */
  }
}

$(window).load(function() {
  initURLchange();
  initLockUnlock();
  initNoAnimation();
});

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
