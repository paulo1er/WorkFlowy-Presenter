function onClickMarker()
{
  chrome.storage.sync.set({"MarkerMode": document.getElementById("marker").checked}, function(){});
}
function initValues()
{
  chrome.storage.sync.get({"MarkerMode": true}, callbackGetValue);
  document.getElementById("marker").addEventListener("change", onClickMarker);
  
  chrome.storage.onChanged.addListener(function(changes, namespace) {
    if ("MarkerMode" in changes) {
      document.getElementById("marker").checked = changes.MarkerMode.newValue;
    };
   });
}
function callbackGetValue(vals)
{
  document.getElementById("marker").checked = vals.MarkerMode;
}

document.addEventListener( "DOMContentLoaded", initValues );