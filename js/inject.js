function initURLchange(){
  var oldURL = "";
  var currentURL = window.location.href;
  $("head").append($("<meta>").attr("name", "urlPrevious").attr("content", ""));
  $("head").append($("<meta>").attr("name", "urlNext").attr("content", ""));
  waitLoad(function(){
    var interval = setInterval(function(){
      try {checkURLchange(oldURL, currentURL)}
      catch {clearInterval(interval); console.warn("previous and next siblings doesn't work")}
    }, 1000);
  });
}

function checkURLchange(oldURL, currentURL){
  currentURL = window.location.href;
  if(currentURL != oldURL){
    $(".selected .content").removeClass("tex2jax_ignore").addClass("tex2jax_process");
    var urlPrevious="";
    var urlNext="";
    var selected = project_tree.getProjectReferenceFromDomProject(selectOnActivePage(".selected"));
    var previous = selected.getPreviousPotentiallyVisibleSibling();
    if (previous != null){
      var temp =  previous.projectid.split("-");
      urlPrevious = "https://workflowy.com/#/" + temp[temp.length-1];
    }
    var next = selected.getNextPotentiallyVisibleSibling();
    if (next != null){
      var temp =  next.projectid.split("-");
      urlNext = "https://workflowy.com/#/" + temp[temp.length-1];
    }
    $("[name=\'urlPrevious\']").attr("content", urlPrevious);
    $("[name=\'urlNext\']").attr("content", urlNext);
    oldURL = currentURL;
  }
}

$(window).load(function() {
  initURLchange();
  initLockUnlock();
});

function waitLoad(callback){
  if($('.selected').length) callback();
  else
    setTimeout(function(){
      waitLoad(callback);
    }, 1000);
}


function initLockUnlock(){
  var metaLock = $("[name=\'lock\']");
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
    metaLock = $("[name=\'lock\']");
    if((isLock != metaLock.attr("content")) || (isPresenter != $("#styleCSS").length)){
      isLock = metaLock.attr("content");
      isPresenter = $("#styleCSS").length;
      if(isLock == "true" && isPresenter) READ_ONLY_MAIN_TREE = true;
      else  READ_ONLY_MAIN_TREE = false;
      console.log("Lock contentent : " + READ_ONLY_MAIN_TREE);
    }
  }, 1000);
}
