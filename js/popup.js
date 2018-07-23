var option = {
  "presenter" : false,
  "isStyleRender" : true,
  "isLatexRender" : true,
  "isMarkdownRender" : true,
  "lockContent" : false,
}

var style = "style1";

function onClick(){
  var name = $(this).attr('id');
  option[name] = $(this).prop('checked');
  chrome.storage.sync.set(option, function(){});
}

function onChangeStyle(){
  style = $(this).val();
  chrome.storage.sync.set({"style" : style}, function(){});
}

function initValues(){
  chrome.storage.sync.get(option, callbackGetValue);
  chrome.storage.sync.get({"style" : style}, callbackGetStyle);

  for (var name in option){
    if (option.hasOwnProperty(name)) {
      $("#"+name).change(onClick);
    }
  }

  $("#style").change(onChangeStyle);

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
    if("style" in changes){
      style = changes["style"].newValue;
      $("#style").val(style);
    }
  });
}

function callbackGetStyle(vals){
  style=vals["style"];
  $("#style").val(style);
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
