var option = {
  "isStyleRender" : true,
  "isLatexRender" : true,
  "isMarkdownRender" : true,
  "lockContent" : false,
  "style" : "style1"
}

var key = function(keyName, keyCode, ctrlKey, shiftKey, altKey){
  this.keyName= keyName;
  this.keyCode = keyCode;
  this.ctrlKey = ctrlKey;
  this.shiftKey = shiftKey;
  this.altKey = altKey;
}

function keyToString(key){
  return ( key.ctrlKey ? "Ctrl + " : "") + ( key.altKey ? "Alt + " : "") + ( key.shiftKey ? "Shift + " : "") + key.keyName;
}

var shortcuts = {
  "beginPresenter" : [ new key("F4", 115, false, false, false) , null ],
  "stopPresenter" : [ new key("Escape", 27, false, false, false) , null ],
  "goParent" : [ new key("ArrowLeft", 37, true, false, false) , null ],
  "goPreviusSibling" : [ new key("ArrowUp", 38, true, false, false) , new key("PageUp", 33, false, false, false) ],
  "goNextSibling" : [ new key("ArrowDown", 40, true, false, false) , new key("PageDown", 34, false, false, false) ],
  "goFirstChild" : [ new key("ArrowRight", 39, true, false, false) , null ],
  "lockInPresenter" : [ null, null],
  "renderStyles" : [ null, null],
  "renderLaTeX" : [ null, null],
  "renderMarkdown" : [ null, null],
  "unlockInPresenter" : [ null, null],
  "leaveStyles" : [ null, null],
  "leaveLaTeX" : [ null, null],
  "leaveMarkdown" : [ null, null],
}

function onClick(){
  var name = $(this).attr('id');
  if($(this).prop("type") == "checkbox") option[name] = $(this).prop('checked');
  else option[name] = $(this).val();
  chrome.storage.sync.set(option, function(){});
}

function eventListener(e){
  var $focus = $(":focus");
  if(e.keyCode != 17 && e.keyCode != 16 && e.keyCode != 18  && e.keyCode != 46 && $focus.is("td.shortcut1, td.shortcut2")) {
    var shortcut = new key(e.key, e.keyCode, e.ctrlKey, e.shiftKey, e.altKey);
    var name = $focus.parent().attr('id');
    if($focus.is("td.shortcut1")) shortcuts[name][0] = shortcut;
    else shortcuts[name][1] = shortcut;
    $focus.text(keyToString(shortcut));
    chrome.storage.sync.set(shortcuts, function(){});
  }
  if(e.keyCode == 46) {
    var name = $focus.parent().attr('id');
    if($focus.is("td.shortcut1")) shortcuts[name][0] = null;
    else shortcuts[name][1] = null;
    $focus.text("");
    chrome.storage.sync.set(shortcuts, function(){});
  }
}


function initValues(){
  chrome.storage.sync.get(option, callbackGetValue);
  chrome.storage.sync.get(shortcuts, callbackGetShortcuts);

  document.addEventListener('keydown', eventListener, false);

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
          warningOptionSelected();
        };
      }
    }
    for (var name in shortcuts){
      if (shortcuts.hasOwnProperty(name)) {
        if (name in changes) {
          shortcuts[name] = changes[name].newValue;
          var row= $("#"+name);
          if(shortcuts[name][0]) row.children(".shortcut1").text(keyToString(shortcuts[name][0]));
          if(shortcuts[name][1]) row.children(".shortcut2").text(keyToString(shortcuts[name][1]));
        };
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

function callbackGetShortcuts(vals){
  shortcuts=vals;
  for (var name in shortcuts){
    if (shortcuts.hasOwnProperty(name)) {
      var row= $("#"+name);
      if(shortcuts[name][0]) row.children().eq(1).text(keyToString(shortcuts[name][0]));
      if(shortcuts[name][1]) row.children().eq(2).text(keyToString(shortcuts[name][1]));
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
