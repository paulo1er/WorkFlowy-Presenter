var option = {
  "presenter" : false
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


  $(".slide").click(function(){
    $("#presenter").prop('checked', !$("#presenter").prop('checked')).trigger("change");
  });

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
}

$(document).ready(function(){
    initValues();
    $('[data-toggle="tooltip"]').tooltip();
});
