var option = {
  "presenter" : false,
  "previewColours" : true,
  "isLatexRender" : true,
  "lockContent" : false,
}

function onClick(){
  var name = this.id;
  option[name] = this.checked;
  chrome.storage.sync.set(option, function(){});
}

function initValues(){
  chrome.storage.sync.get(option, callbackGetValue);

  for (var name in option){
    if (option.hasOwnProperty(name)) {
      document.getElementById(name).addEventListener("change", onClick);
    }
  }


  chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (var name in option){
      if (option.hasOwnProperty(name)) {
        if (name in changes) {
          option[name] = changes[name].newValue;
          document.getElementById(name).checked = option[name];
        };
      }
    }
  });

  setInterval(function(){
    document.getElementById("needLock").hidden = !option["isLatexRender"] || option["lockContent"];
  },100);
}

function callbackGetValue(vals){
  option=vals;
  for (var name in option){
    if (option.hasOwnProperty(name)) {
      document.getElementById(name).checked = option[name];
    }
  }
}

document.addEventListener( "DOMContentLoaded", initValues );
