var option = {
  "presenter" : false,
  "isStyleRender" : true,
  "isLatexRender" : true,
  "isMarkdownRender" : true,
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
        warningOptionSelected();
      }
    }
  });
}

function callbackGetValue(vals){
  option=vals;
  for (var name in option){
    if (option.hasOwnProperty(name)) {
      $("#"+name).attr('checked', option[name]);
    }
  }
  warningOptionSelected();
}

function warningOptionSelected(){
  if(!(option["isLatexRender"]  || option["isMarkdownRender"])  || option["lockContent"]) $("#needLock").hide();
  else $("#needLock").show();
}

$(document).ready(function(){
    initValues();
    $('[data-toggle="tooltip"]').tooltip();
});
