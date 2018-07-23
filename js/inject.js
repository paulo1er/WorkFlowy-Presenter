function updateUrlSibling(){
  var urlPrevious="";
  var urlNext="";
  var selected = project_tree.getProjectReferenceFromDomProject(selectOnActivePage(".selected"));
  var previous = selected.getPreviousPotentiallyVisibleSibling();
  if (previous != null){
    urlPrevious = "https://workflowy.com/#/" + project_ids.truncateProjectId(previous.projectid);
  }
  var next = selected.getNextPotentiallyVisibleSibling();
  if (next != null){
    urlNext = "https://workflowy.com/#/" + project_ids.truncateProjectId(next.projectid);
  }
  $("[name=\'urlPrevious\']").attr("content", urlPrevious);
  $("[name=\'urlNext\']").attr("content", urlNext);
};

var oldURL = "";
var currentURL = window.location.href;
$("head").append($("<meta>").attr("name", "urlPrevious").attr("content", ""));
$("head").append($("<meta>").attr("name", "urlNext").attr("content", ""));

function checkURLchange(){
  currentURL = window.location.href;
  if(currentURL != oldURL){
    $(".selected .content").removeClass("tex2jax_ignore").addClass("tex2jax_process");
    updateUrlSibling();
    oldURL = currentURL;
  }
}

$(window).load(function() {
  waitLoad(function(){
    setInterval(checkURLchange, 1000);
  });
  initLockUnlock();
});

function waitLoad(callback){
  if($('.selected').length) callback();
  else
    setInterval(function(){
      waitLoad(callback);
    }, 1000);
}


function initLockUnlock(){
  var metaLock = $("[name=\'lock\']");
  var isLock;
  if(!metaLock.length){
    metaLock = $("<meta>").attr("name", "lock").attr("content", "false");
    $("head").append(metaLock);
  }
  isLock = metaLock.attr("content");
  if(isLock == "true") READ_ONLY_MAIN_TREE = true;
  else  READ_ONLY_MAIN_TREE = false;
  console.log("Lock contentent : " + READ_ONLY_MAIN_TREE);

  setInterval(function(){
    metaLock = $("[name=\'lock\']");
    if(isLock != metaLock.attr("content")){
      isLock = metaLock.attr("content");
      if(isLock == "true") READ_ONLY_MAIN_TREE = true;
      else  READ_ONLY_MAIN_TREE = false;
      console.log("Lock contentent : " + READ_ONLY_MAIN_TREE);
    }
  }, 1000);
}
