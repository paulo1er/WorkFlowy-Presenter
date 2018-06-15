function onClickPresenter(){
  chrome.storage.sync.set({"presenter": document.getElementById("presenter").checked}, function(){});
}

function initValues(){
  chrome.storage.sync.get({"presenter":true}, callbackGetValue);
  document.getElementById("presenter").addEventListener("change", onClickPresenter);

  chrome.storage.onChanged.addListener(function(changes, namespace) {
    if ("presenter" in changes) {
      document.getElementById("presenter").checked = changes.presenter.newValue;
    };
   });
}

function callbackGetValue(vals){
  document.getElementById("presenter").checked = vals.presenter;
}

document.addEventListener( "DOMContentLoaded", initValues );
