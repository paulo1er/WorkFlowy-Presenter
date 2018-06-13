function onClickMarker(){
  chrome.storage.sync.set({"MarkerMode": document.getElementById("marker").checked}, function(){});
}

function onClickPresenter(){
  chrome.storage.sync.set({"presenter": document.getElementById("presenter").checked}, function(){});
}

function initValues(){
  chrome.storage.sync.get({"MarkerMode": true, "presenter":true}, callbackGetValue);
  document.getElementById("marker").addEventListener("change", onClickMarker);
  document.getElementById("presenter").addEventListener("change", onClickPresenter);

  chrome.storage.onChanged.addListener(function(changes, namespace) {
    if ("MarkerMode" in changes) {
      document.getElementById("marker").checked = changes.MarkerMode.newValue;
    };
    if ("presenter" in changes) {
      document.getElementById("presenter").checked = changes.presenter.newValue;
    };
   });
}

function callbackGetValue(vals){
  document.getElementById("marker").checked = vals.MarkerMode;
  document.getElementById("presenter").checked = vals.presenter;
}

document.addEventListener( "DOMContentLoaded", initValues );
