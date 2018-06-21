function onClickPresenter(){
  chrome.storage.sync.set({"presenter": document.getElementById("presenter").checked}, function(){});
}

function onClickPreviewColours(){
  chrome.storage.sync.set({"previewColours": document.getElementById("previewColours").checked}, function(){});
}
function onClickLatexRender(){
  chrome.storage.sync.set({"isLatexRender": document.getElementById("isLatexRender").checked}, function(){});
}

function initValues(){
  chrome.storage.sync.get({"presenter":false, "previewColours":true,  "isLatexRender":true}, callbackGetValue);
  document.getElementById("presenter").addEventListener("change", onClickPresenter);
  document.getElementById("previewColours").addEventListener("change", onClickPreviewColours);
  document.getElementById("isLatexRender").addEventListener("change", onClickLatexRender);


  chrome.storage.onChanged.addListener(function(changes, namespace) {
    if ("presenter" in changes) {
      document.getElementById("presenter").checked = changes.presenter.newValue;
    };
    if ("previewColours" in changes) {
      document.getElementById("previewColours").checked = changes.previewColours.newValue;
    };
    if ("isLatexRender" in changes) {
      document.getElementById("isLatexRender").checked = changes.isLatexRender.newValue;
    };
   });
}

function callbackGetValue(vals){
  document.getElementById("presenter").checked = vals.presenter;
  document.getElementById("previewColours").checked = vals.previewColours;
  document.getElementById("isLatexRender").checked = vals.isLatexRender;
}

document.addEventListener( "DOMContentLoaded", initValues );
