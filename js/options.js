var options = {
  "isStyleRender" : true,
  "isLatexRender" : true,
  "isMarkdownRender" : true,
  "lockContent" : false,
  "isAnimated" : true,
  "styleTag" : "wfp-",
  "theme" : "theme1",
}

var mlnw = "Make lists. Not war.";

var key = function(keyName, keyCode, ctrlKey, shiftKey, altKey){
  this.keyName= keyName;
  this.keyCode = keyCode;
  this.ctrlKey = ctrlKey;
  this.shiftKey = shiftKey;
  this.altKey = altKey;
}

function copy(obj) {
  if (null == obj || "object" != typeof obj) return obj;
  var c = new obj.constructor();
  for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) c[attr] = obj[attr];
  }
  return c;
}

function keyToString(key){
  return ( key.ctrlKey ? "Ctrl + " : "") + ( key.altKey ? "Alt + " : "") + ( key.shiftKey ? "Shift + " : "") + key.keyName;
}

var shortcuts = {
  "startPresenter" : [ new key("F4", 115, false, false, false) , null ],
  "stopPresenter" : [ new key("Escape", 27, false, false, false) , null ],
  "goParent" : [ new key("ArrowLeft", 37, true, false, false) , null ],
  "goPreviusSibling" : [ new key("ArrowUp", 38, true, false, false) , new key("PageUp", 33, false, false, false) ],
  "goNextSibling" : [ new key("ArrowDown", 40, true, false, false) , new key("PageDown", 34, false, false, false) ],
  "goFirstChild" : [ new key("ArrowRight", 39, true, false, false) , null ],
  "lockInPresenter" : [ null, null],
  "enableAnimation" : [ null, null],
  "renderStyles" : [ null, null],
  "renderLaTeX" : [ null, null],
  "renderMarkdown" : [ null, null],
  "unlockInPresenter" : [ null, null],
  "disableAnimation" : [ null, null],
  "leaveStyles" : [ null, null],
  "leaveLaTeX" : [ null, null],
  "leaveMarkdown" : [ null, null],
}

function onClick(){
  var name = $(this).attr('id');
  if($(this).prop("type") == "checkbox") options[name] = $(this).prop('checked');
  else options[name] = $(this).val();
  chrome.storage.sync.set(options, function(){});
}

function clickShortcut2(){
  if($(this).parent().children(".shortcut1").text() == "")
    $(this).parent().children(".shortcut1").focus();
}

function eventListener(e){
  var $focus = $(":focus");
  if(e.keyCode != 17 && e.keyCode != 16 && e.keyCode != 18  && e.keyCode != 46 && $focus.is("td.shortcut1, td.shortcut2")) {
    var shortcut = new key(e.key, e.keyCode, e.ctrlKey, e.shiftKey, e.altKey);
    var name = $focus.parent().attr('id');
    if($focus.is("td.shortcut1")) shortcuts[name][0] = shortcut;
    else shortcuts[name][1] = shortcut;
    $focus.text(keyToString(shortcut));
    console.log("The shortcut for "+name+" is now", shortcuts[name], $focus);
    chrome.storage.sync.set(shortcuts, function(){});
  }
  if(e.keyCode == 46) {
    var name = $focus.parent().attr('id');
    if($focus.is("td.shortcut1")){
      if($focus.parent().children(".shortcut2").text() == ""){
        shortcuts[name][0] = null;
        $focus.text("");
      }
      else {
        shortcuts[name][0] = copy(shortcuts[name][1]);
        shortcuts[name][1] = null;
        $focus.text($focus.parent().children(".shortcut2").text());
        $focus.parent().children(".shortcut2").text("");
      }
    }
    else{
      shortcuts[name][1] = null;
      $focus.text("");
    }
    console.log("The shortcut for "+name+" is now", shortcuts[name]);
    chrome.storage.sync.set(shortcuts, function(){});
  }
}


function initValues(){
  chrome.storage.sync.get(options, callbackGetValue);
  chrome.storage.sync.get(shortcuts, callbackGetShortcuts);
  chrome.storage.sync.get({"mlnw":mlnw}, callbackGetMlnw);

  document.addEventListener('keydown', eventListener, false);

  for (var name in options){
    if (options.hasOwnProperty(name)) {
      $("#"+name).change(onClick);
    }
  }

  for (var name in shortcuts){
    if (shortcuts.hasOwnProperty(name)) {
      $("#"+name).children(".shortcut2").click(clickShortcut2);
    }
  }

  $('#mlnw').on('blur', function() {
      if ($(this).data('before') !== $(this).html()) {
          $(this).data('before', $(this).html());
          mlnw = $(this).html();
          console.log(mlnw);
          chrome.storage.sync.set({"mlnw":mlnw}, function(){});
      }
  });


  $('#styleTag').bind('keyup blur',function(){
    var regex = /^(([a-z0-9])+[-:_]?)*$/g;
    var str= $(this).val();
    while(!regex.test(str)) {
      str = str.replace(/.$/g,'');
    }
    $(this).val(str);
  });


  chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (var name in options){
      if (options.hasOwnProperty(name)) {
        if (name in changes) {
          options[name] = changes[name].newValue;
          if($("#"+name).prop("type") == "checkbox") $("#"+name).prop('checked', options[name]);
          else $("#"+name).val(options[name]);
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
    if("mlnw" in changes){
      mlnw = changes["mlnw"].newValue;
      $('#mlnw').html(mlnw);
    }
  });

  $('head').append($('<link>')
    .attr("id","themeCSS")
    .attr("rel","stylesheet")
    .attr("type","text/css")
    .attr("href", ""));
}

function callbackGetValue(vals){
  options=vals;
  for (var name in options){
    if (options.hasOwnProperty(name)) {
      if($("#"+name).prop("type") == "checkbox") $("#"+name).prop('checked', options[name]);
      else $("#"+name).val(options[name]);
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

function callbackGetMlnw(vals){
  if(vals["mlnw"] && vals["mlnw"] != ""){
    mlnw = vals["mlnw"];
    console.log(mlnw);
    $('#mlnw').html(mlnw);
  }
}

function warningOptionSelected(){
  if(!(options["isLatexRender"]  || options["isMarkdownRender"])  || options["lockContent"]) $("#needLock").hide();
  else $("#needLock").show();

  $("#themeCSS").attr("href", chrome.extension.getURL('css/theme/'+options["theme"]+'.css'));


  $(".prefix-style-tag").text(options["styleTag"]);

  if(options["isStyleRender"]) $(".content-with-tag").css("color", "Gray");
  else $(".content-with-tag").css("color", "");
}

$(document).ready(function(){
    initValues();
    $('[data-toggle="tooltip"]').tooltip();
});
