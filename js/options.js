var option = {
  "isStyleRender" : true,
  "isLatexRender" : true,
  "isMarkdownRender" : true,
  "lockContent" : false,
  "style" : "style1"
}

function onClick(){
  var name = $(this).attr('id');
  if($(this).prop("type") == "checkbox") option[name] = $(this).prop('checked');
  else option[name] = $(this).val();
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
          if($("#"+name).prop("type") == "checkbox") $("#"+name).prop('checked', option[name]);
          else $("#"+name).val(option[name]);
        };
        warningOptionSelected();
      }
    }
  });

  path = chrome.extension.getURL('css/style/'+option["style"]+'.css');
  $('head').append($('<link>')
    .attr("id","styleCSS")
    .attr("rel","stylesheet")
    .attr("type","text/css")
    .attr("href", path));
}

function callbackGetValue(vals){
  option=vals;
  for (var name in option){
    if (option.hasOwnProperty(name)) {
      if($("#"+name).prop("type") == "checkbox") $("#"+name).prop('checked', option[name]);
      else $("#"+name).val(option[name]);
    }
  }
  warningOptionSelected();
}

function warningOptionSelected(){
  if(!(option["isLatexRender"]  || option["isMarkdownRender"])  || option["lockContent"]) $("#needLock").hide();
  else $("#needLock").show();

  $("#styleCSS").attr("href", chrome.extension.getURL('css/style/'+option["style"]+'.css'));
}

$(document).ready(function(){
    initValues();
    $('[data-toggle="tooltip"]').tooltip();
});
