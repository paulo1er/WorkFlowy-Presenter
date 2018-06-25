var option = {
  "presenter" : false,
  "previewColours" : true,
  "isLatexRender" : true,
  "lockContent" : false,
}

function onClick(){
  var name = $(this).attr('id');
  option[name] = $(this).prop('checked');
  chrome.storage.sync.set(option, function(){});
}

function initValues(){
  chrome.storage.sync.get(option, callbackGetValue);

  for (var name in option){
    if (option.hasOwnProperty(name)) {
      $("#"+name).change(onClick);
    }
  }


  chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (var name in option){
      if (option.hasOwnProperty(name)) {
        if (name in changes) {
          option[name] = changes[name].newValue;
          $("#"+name).attr('checked', option[name]);
        };
      }
    }
  });

  setInterval(function(){
    if(!option["isLatexRender"] || option["lockContent"]) $("#needLock").hide();
    else $("#needLock").show();
  },100);
}

function callbackGetValue(vals){
  option=vals;
  for (var name in option){
    if (option.hasOwnProperty(name)) {
      $("#"+name).attr('checked', option[name]);
    }
  }
}

$("document").ready(initValues);
